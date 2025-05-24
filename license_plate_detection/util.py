import cv2
from ultralytics import YOLO
import re
from tkinter import Tk, filedialog
import os
from concurrent.futures import ThreadPoolExecutor, as_completed
import time
import numpy as np
import requests
from dotenv import load_dotenv
import os
import threading

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

def registrar_placa_via_api(placa, ipcamera):
    """
    Envia uma solicitação para registrar a placa no backend via API.
    """
    api_url = "http://127.0.0.1:5000/yolo/register_car"
    headers = {"Content-Type": "application/json"}
    data = {"license_plate": placa,
            "last_location": ipcamera}
    print(f"Enviando placa {placa} para API...")
    try:
        login_url = "http://127.0.0.1:5000/auth/login"
        login_data = {"name": os.getenv("YOLO_USER"), "password": os.getenv("YOLO_PASS")}
        try:
            login_response = requests.post(login_url, json=login_data, headers=headers)
            login_response.raise_for_status()
            token = login_response.json().get("token")
            if not token:
                raise ValueError("Failed to retrieve access token")
            headers["Authorization"] = f"Bearer {token}"
        except requests.exceptions.RequestException as e:
            print(f"Falha ao obter token de autenticação: {e}")
            return False

        response = requests.post(api_url, json=data, headers=headers)
        response.raise_for_status()
        print(f"API Response: {response.json()}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Falha ao enviar placa para API: {e}")
        return False
    
def registrar_local_via_api(placa, ip_camera):
    """
    Envia uma solicitação para registrar em qual camera a placa esta via API.
    """
    api_url = "http://127.0.0.1:5000/yolo/update_last_location"
    headers = {"Content-Type": "application/json"}
    data = {"license_plate" : placa,
            "last_location" : ip_camera}
    print(f"Atualizando Local do veículo com placa {placa} na API...")
    try:
        login_url = "http://127.0.0.1:5000/auth/login"
        login_data = {"name": os.getenv("YOLO_USER"), "password": os.getenv("YOLO_PASS")}
        try:
            login_response = requests.post(login_url, json=login_data, headers=headers)
            login_response.raise_for_status()
            token = login_response.json().get("token")
            if not token:
                raise ValueError("Failed to retrieve access token")
            headers["Authorization"] = f"Bearer {token}"
        except requests.exceptions.RequestException as e:
            print(f"Falha ao obter token de autenticação: {e}")
            return False

        response = requests.patch(api_url, json=data, headers=headers)
        response.raise_for_status()
        print(f"API Response: {response.json()}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Falha ao enviar placa para API: {e}")
        return False
    
def procurar_veiculo(placa, cameras_de_seguranca, placa_model, caracteres_model):

    while True:
        with ThreadPoolExecutor() as executor:
            futures = {
                executor.submit(verificar_camera, ip, placa_model, caracteres_model): ip
                for ip in cameras_de_seguranca
            }

            for future in as_completed(futures):
                ip_camera = futures[future]
                encontrado = future.result()

                if encontrado:
                    with lock:
                        if placas_detectadas.get(placa) != ip_camera:
                            placas_detectadas[placa] = ip_camera
                            print(f'Placa {placa} AGORA está na câmera {ip_camera}')
                            registrar_local_via_api(placa, ip_camera)
                    break

        time.sleep(2) 


def verificar_camera(ip_webcam, placa_model, caracteres_model):
    cap = cv2.VideoCapture(f'http://{ip_webcam}/video')
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

        for box, cls_idx in zip(boxes, classes):
            x1, y1, x2, y2 = map(int, box)
            class_name = placa_model.model.names[int(cls_idx)]

            placa_crop = frame[y1:y2, x1:x2]
            if placa_crop.size == 0:
                continue

            caracteres_result = caracteres_model(placa_crop, verbose=False)[0]

            caracteres_detectados = []
            for char_box in caracteres_result.boxes.data.tolist():
                cx1, cy1, cx2, cy2, score, char_id = char_box
                char_label = caracteres_model.model.names[int(char_id)]
                caracteres_detectados.append({
                    'label': char_label,
                    'x1': cx1,
                    'score': score
                })

            caracteres_ordenados = sorted(caracteres_detectados, key=lambda c: c['x1'])
            placa_texto = ''.join([c['label'] for c in caracteres_ordenados])

            todas_confiancas_validas = all(c['score'] >= 0.85 for c in caracteres_ordenados)

            if todas_confiancas_validas:
                return True

    return False


def get_placas(ip_principal, lista_ip_webcam, placa_model, caracteres_model):

    cap = cv2.VideoCapture(f'http://{ip_principal}/video')

    if not cap.isOpened():
        print("Não foi possível abrir a câmera principal.")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Falha ao capturar frame.")
            break

        frame = cv2.resize(frame, (960, 540))

        placas_result = placa_model(frame, verbose=False)

        for r in placas_result:
            boxes = r.boxes.xyxy.cpu().numpy()
            classes = r.boxes.cls.cpu().numpy()
            confianca = r.boxes.conf.cpu().numpy()
            
            if all(conf > 0.8 for conf in confianca): 
                for box, cls_idx in zip(boxes, classes):
                    x1, y1, x2, y2 = map(int, box)
                    class_name = placa_model.model.names[int(cls_idx)]
                    
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

                    placa_crop = frame[y1:y2, x1:x2]
                    if placa_crop.size == 0:
                        continue

                    caracteres_result = caracteres_model(placa_crop, verbose=False)[0]

                    caracteres_detectados = []
                    for char_box in caracteres_result.boxes.data.tolist():
                        cx1, cy1, cx2, cy2, score, char_id = char_box
                        char_label = caracteres_model.model.names[int(char_id)]
                        caracteres_detectados.append({
                            'label': char_label,
                            'x1': cx1,
                            'score': score
                        })

                    caracteres_ordenados = sorted(caracteres_detectados, key=lambda c: c['x1'])
                    placa_texto = corrigir_formato(''.join([c['label'] for c in caracteres_ordenados]), class_name)

                    todas_confiancas_validas = all(c['score'] >= 0.85 for c in caracteres_ordenados)

                    if validar_formato(placa_texto, class_name) and todas_confiancas_validas:
                        with lock:
                            if placa_texto not in placas_detectadas:
                                placas_detectadas[placa_texto] = ip_principal
                                print(f"Nova placa detectada: {placa_texto} na câmera {ip_principal}")
                                
                                registrar_placa_via_api(placa_texto, ip_principal)
                                
                                threading.Thread(
                                    target=procurar_veiculo,
                                    args=(placa_texto, lista_ip_webcam, placa_model, caracteres_model),
                                    daemon=True
                                ).start()
                        cv2.putText(frame, placa_texto, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

        cv2.imshow('Leitor de Placas', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    lista_ip_webcam = os.getenv("LISTA_IP_WEBCAM", "").split(",")
    ip_principal = os.getenv("IP_CAM")
    placa_model = YOLO('../yolo_model/plate_detection.pt')
    caracteres_model = YOLO('../yolo_model/character_detection.pt')

    thread_get = threading.Thread(target=get_placas, args=(ip_principal, lista_ip_webcam, placa_model, caracteres_model))
    

    thread_get.start()

    thread_get.join()


    print("\nPlacas monitoradas e localizadas:")
    with lock:
        for placa, camera in placas_detectadas.items():
            print(f"Placa {placa} está na câmera {camera}")