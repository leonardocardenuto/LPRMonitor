import cv2
from ultralytics import YOLO
import re
import os
import time
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
import numpy as np
import requests
from dotenv import load_dotenv
import re 

dotenv_path = os.path.join(os.path.dirname(__file__), '..', 'flask_back', '.env')
load_dotenv(dotenv_path)

placas_detectadas = {}
lock = threading.Lock()



def corrigir_formato(texto, classe):
    letra_para_num = {'A': '4', 'B': '8', 'E': '3', 'G': '6', 'I': '1', 'O': '0', 'S': '5', 'T': '7', 'Z': '2'}
    num_para_letra = {'0': 'O', '1': 'I', '2': 'Z', '3': 'E', '4': 'A', '5': 'S', '6': 'G', '7': 'T', '8': 'B'}

    texto = texto.replace(' ', '').upper()
    texto_corrigido = list(texto)

    if classe in ['old_license_plate', 'red_old_license_plate']:
        for i in range(min(3, len(texto_corrigido))):
            texto_corrigido[i] = num_para_letra.get(texto_corrigido[i], texto_corrigido[i])
        for i in range(3, len(texto_corrigido)):
            texto_corrigido[i] = letra_para_num.get(texto_corrigido[i], texto_corrigido[i])

    elif classe in ['mercosul_license_plate', 'red_mercosul_license_plate']:
        for i in [0, 1, 2, 4]:
            if i < len(texto_corrigido):
                texto_corrigido[i] = num_para_letra.get(texto_corrigido[i], texto_corrigido[i])
        for i in [3, 5, 6]:
            if i < len(texto_corrigido):
                texto_corrigido[i] = letra_para_num.get(texto_corrigido[i], texto_corrigido[i])

    return ''.join(texto_corrigido)


def validar_formato(texto, classe):
    if classe in ['old_license_plate', 'red_old_license_plate']:
        return re.fullmatch(r'[A-Z]{3}[0-9]{4}', texto)
    elif classe in ['new_license_plate', 'red_new_license_plate']:
        return re.fullmatch(r'[A-Z]{3}[0-9][A-Z][0-9]{2}', texto)
    return False

class APIClient:
    def __init__(self):
        self.base_url = "http://127.0.0.1:5000"
        self.session = requests.Session()
        self.token = None
        self.authenticate()

    def authenticate(self):
        login_data = {
            "name": os.getenv("YOLO_USER"),
            "password": os.getenv("YOLO_PASS")
        }
        try:
            response = self.session.post(f"{self.base_url}/auth/login", json=login_data)
            response.raise_for_status()
            self.token = response.json().get("token")
            if not self.token:
                raise ValueError("Failed to retrieve access token")
            self.session.headers.update({
                "Authorization": f"Bearer {self.token}",
                "Content-Type": "application/json"
            })
            print("✅ Autenticado na API")
        except Exception as e:
            print(f"❌ Erro na autenticação: {e}")

    def registrar_placa(self, placa, ipcamera):
        data = {"license_plate": placa, "camera_id": ipcamera}
        try:
            response = self.session.post(f"{self.base_url}/yolo/register_car", json=data)
            response.raise_for_status()
            print(f"✅ Placa {placa} registrada")
        except Exception as e:
            print(f"❌ Erro ao registrar placa {placa}: {e}")

    def listar_cameras(self):
        try:
            response = self.session.get(f"{self.base_url}/yolo/list-all-cameras")
            response.raise_for_status()
            cameras = response.json().get("cameras", [])
            return cameras
        except Exception as e:
            print(f"❌ Erro ao listar câmeras: {e}")
            return []

    def atualizar_local(self, placa, ipcamera):
        data = {"license_plate": placa, "last_location": ipcamera}
        try:
            response = self.session.patch(f"{self.base_url}/yolo/update_last_location", json=data)
            response.raise_for_status()
            print(f"✅ Localização da placa {placa} atualizada para {ipcamera}")
        except Exception as e:
            print(f"❌ Erro ao atualizar localização da placa {placa}: {e}")
    
    def deletar_veiculo(self, placa):
        try:
            data = {"license_plate": placa}
            response = self.session.delete(f"{self.base_url}/yolo/delete_exiting_car", json=data)
            response.raise_for_status()
            print(f"🏁 Saída do veículo {placa} confirmada")
        except Exception as e:
            print(f"❌ Erro ao confirmar saída do veiculo com placa {placa}: {e}")
        

def verificar_camera(ip_webcam, placa_model, caracteres_model, target_plate: str) -> bool:
    cap = cv2.VideoCapture(f'http://{ip_webcam}:8080/video')
    if not cap.isOpened():
        return False

    ret, frame = cap.read()
    cap.release()
    if not ret:
        return False

    placas_result = placa_model(frame, verbose=False)
    for r in placas_result:
        boxes = r.boxes.xyxy.cpu().numpy()
        classes = r.boxes.cls.cpu().numpy()
        confiancas = r.boxes.conf.cpu().numpy()

        for box, cls_idx, conf in zip(boxes, classes, confiancas):
            if conf < 0.8:
                continue

            x1, y1, x2, y2 = map(int, box)
            class_name = placa_model.model.names[int(cls_idx)]
            placa_crop = frame[y1:y2, x1:x2]
            if placa_crop.size == 0:
                continue

            caracteres_result = caracteres_model(placa_crop, verbose=False)[0]
            caracteres_detectados = [
                {'label': caracteres_model.model.names[int(c[5])], 'x1': c[0], 'score': c[4]}
                for c in caracteres_result.boxes.data.tolist()
            ]
            caracteres_ordenados = sorted(caracteres_detectados, key=lambda c: c['x1'])
            placa_texto = corrigir_formato(''.join([c['label'] for c in caracteres_ordenados]), class_name)

            if placa_texto == target_plate and all(c['score'] >= 0.85 for c in caracteres_ordenados):
                return True

    return False



def procurar_veiculo(placa, cameras, jsoncameras, placa_model, caracteres_model, api_client):
    with ThreadPoolExecutor(max_workers=len(cameras)) as executor:
        while True:
            futures = {
                executor.submit(verificar_camera, ip, placa_model, caracteres_model, placa): ip
                for ip in cameras
            }

            for future in as_completed(futures):
                ip_camera = futures[future]
                encontrado = future.result()

                if encontrado:
                    with lock:
                        if placas_detectadas.get(placa) != ip_camera:
                            for camera in jsoncameras:
                                if camera['camera_ip'] == ip_camera:
                                    print(placas_detectadas)
                                    if re.match(r'^\s*saída\s*$|^\s*sai[^\s]*\s*$', camera['place'], re.IGNORECASE): #Verifica se a camera é uma saida 
                                        api_client.deletar_veiculo(placa)
                                        print(f"antes: {placas_detectadas}")
                                        placas_detectadas.pop(placa) 
                                        print(f"depois: {placas_detectadas}")       
                                                             
                                    else:
                                        camera_id = camera['id']
                                        local_camera = camera['place']
                                        placas_detectadas[placa] = ip_camera
                                        print(f"🚗 Placa {placa} agora está na câmera: {local_camera}")
                                        api_client.atualizar_local(placa, camera_id)
                    break  
            time.sleep(2)




def get_placas(cameras, placa_model, caracteres_model, api_client):
    id_camera_principal = cameras[0]['id']
    lista_ip_webcam = [camera['camera_ip'] for camera in cameras]

    cap = cv2.VideoCapture(f'http://{cameras[0]['camera_ip']}:8080/video')

    if not cap.isOpened():
        print("❌ Não foi possível abrir a câmera principal.")
        return
    while True:
        ret, frame = cap.read()
        if not ret:
            print("❌ Falha ao capturar frame.")
            break

        frame = cv2.resize(frame, (960, 540))

        placas_result = placa_model(frame, verbose=False)

        for r in placas_result:
            boxes = r.boxes.xyxy.cpu().numpy()
            classes = r.boxes.cls.cpu().numpy()
            confiancas = r.boxes.conf.cpu().numpy()

            for box, cls_idx, conf in zip(boxes, classes, confiancas):
                if conf < 0.8:
                    continue

                x1, y1, x2, y2 = map(int, box)
                class_name = placa_model.model.names[int(cls_idx)]

                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

                placa_crop = frame[y1:y2, x1:x2]
                if placa_crop.size == 0:
                    continue

                caracteres_result = caracteres_model(placa_crop, verbose=False)[0]
                caracteres_detectados = [
                    {'label': caracteres_model.model.names[int(c[5])], 'x1': c[0], 'score': c[4]}
                    for c in caracteres_result.boxes.data.tolist()
                ]

                caracteres_ordenados = sorted(caracteres_detectados, key=lambda c: c['x1'])
                placa_texto = corrigir_formato(''.join([c['label'] for c in caracteres_ordenados]), class_name)

                if validar_formato(placa_texto, class_name) and all(c['score'] >= 0.85 for c in caracteres_ordenados):
                    with lock:
                        if placa_texto not in placas_detectadas:
                            placas_detectadas[placa_texto] = cameras[0]['camera_ip']
                            print(f"✅ Nova placa detectada: {placa_texto} na câmera: {cameras[0]['place']}")
                            api_client.registrar_placa(placa_texto, id_camera_principal)

                            threading.Thread(
                                target=procurar_veiculo,
                                args=(placa_texto, lista_ip_webcam, cameras, placa_model, caracteres_model, api_client),
                                daemon=True
                            ).start()

                    cv2.putText(frame, placa_texto, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX,
                                0.9, (0, 255, 0), 2)

        cv2.imshow('Leitor de Placas', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()




if __name__ == "__main__":
    placa_model = YOLO('../yolo_model/plate_detection.pt')
    caracteres_model = YOLO('../yolo_model/character_detection.pt')

    api_client = APIClient()
    cameras = api_client.listar_cameras()

    thread_get = threading.Thread(
        target=get_placas,
        args=(cameras, placa_model, caracteres_model, api_client)
    )

    thread_get.start()
    print("🔎 Detectando placas.")
    thread_get.join()

    print("\n📋 Placas monitoradas e localizadas:")
    with lock:
        for placa, camera in placas_detectadas.items():
            print(f"➡️ Placa {placa} na câmera: {camera}")