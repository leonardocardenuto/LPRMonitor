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

dotenv_path = os.path.join(os.path.dirname(__file__), '..', 'flask_back', '.env')
load_dotenv(dotenv_path)

def selecionar_video():
    root = Tk()
    root.withdraw()
    return filedialog.askopenfilename(
        title="Selecione um vídeo",
        filetypes=[("Arquivos de vídeo", "*.mp4 *.avi *.mov")]
    )

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


def registrar_placa_via_api(placa):
    """
    Envia uma solicitação para registrar a placa no backend via API.
    """
    api_url = "http://127.0.0.1:5000/yolo/register_car"
    headers = {"Content-Type": "application/json"}
    data = {"license_plate": placa}
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

def procurar_veiculo(placa_procurada, ip_webcam, placa_model, caracteres_model): 
    frame_count = 0   
    cap = cv2.VideoCapture(f'http://{ip_webcam}/video') 

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Falha ao capturar frame. Saindo...")
            break
        
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
                        'bbox': [cx1, cy1, cx2, cy2],
                        'x1': cx1,
                        'score': score
                    })

                caracteres_ordenados = sorted(caracteres_detectados, key=lambda c: c['x1'])

                placa_texto = corrigir_formato(''.join([c['label'] for c in caracteres_ordenados]), class_name)

                todas_confiancas_validas = all(c['score'] >= 0.7 for c in caracteres_ordenados)
                
                if validar_formato(placa_texto, class_name) and todas_confiancas_validas:
                    if placa_texto == placa_procurada:
                        print(f'Carro com placa {placa_procurada} encontrado na câmera de IP {ip_webcam}')
                        cap.release()
                        return ip_webcam

        if frame_count >= 200: # Um tempo para que o veiculo possa ser procuraado
            break

    cap.release()
    return None


def perseguir_veiculo(placa, cameras_de_seguranca):
    placa_model = YOLO('../yolo_model/plate_detection.pt')                
    caracteres_model = YOLO('../yolo_model/character_detection.pt')

    with ThreadPoolExecutor() as executor:
        futures = [
            executor.submit(procurar_veiculo, placa, ip, placa_model, caracteres_model)
            for ip in cameras_de_seguranca
        ]

        for future in as_completed(futures):
            resultado = future.result()
            if resultado is not None:
                return True  

    return False 

import os
import cv2
import time
from ultralytics import YOLO


def get_placas():
    placa_model = YOLO('../yolo_model/plate_detection.pt')
    caracteres_model = YOLO('../yolo_model/character_detection.pt')
    
    placas_diferentes = []

    ip_webcam = os.getenv("IP_CAM")
    lista_ip_webcam = os.getenv("LISTA_IP_WEBCAM")
    lista_ip = lista_ip_webcam.split(",") if lista_ip_webcam else []

    cap = cv2.VideoCapture(f'http://{ip_webcam}/video')

    if not cap.isOpened():
        print("Não foi possível abrir a câmera. Verifique o IP.")
        return []

    intervalo_processamento = 0.5  
    ultimo_tempo = time.time()

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Falha ao capturar frame. Saindo...")
            break

        frame = cv2.resize(frame, (960, 540))

        tempo_atual = time.time()
        if tempo_atual - ultimo_tempo >= intervalo_processamento:
            ultimo_tempo = tempo_atual

            placas_result = placa_model(frame, verbose=False)

            for r in placas_result:
                boxes = r.boxes.xyxy.cpu().numpy()
                classes = r.boxes.cls.cpu().numpy()

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
                            'bbox': [cx1, cy1, cx2, cy2],
                            'x1': cx1,
                            'score': score
                        })

                    caracteres_ordenados = sorted(caracteres_detectados, key=lambda c: c['x1'])
                    placa_texto = corrigir_formato(''.join([c['label'] for c in caracteres_ordenados]), class_name)

                    todas_confiancas_validas = all(c['score'] >= 0.7 for c in caracteres_ordenados)

                    if validar_formato(placa_texto, class_name) and todas_confiancas_validas:
                        if placa_texto not in placas_diferentes:
                            if registrar_placa_via_api(placa_texto):
                                placas_diferentes.append(placa_texto)
                            else:
                                placas_diferentes.append(placa_texto)

                            print("\nPlacas detectadas:")
                            for i, placa in enumerate(placas_diferentes):
                                print(f"{i}: {placa}")

                        cv2.putText(frame, placa_texto, (x1, y1 - 10),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

        cv2.imshow('Leitor de Placas', frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        elif ord('0') <= key <= ord('9'):
            idx = key - ord('0')
            if idx < len(placas_diferentes):
                print(f"Iniciando rastreamento para a placa: {placas_diferentes[idx]}")
                perseguir_veiculo(placas_diferentes[idx], lista_ip)

    cap.release()
    cv2.destroyAllWindows()
    return placas_diferentes

get_placas()