import cv2
from ultralytics import YOLO
import re
from tkinter import Tk, filedialog

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


placa_model = YOLO('best.pt')                
caracteres_model = YOLO('character_detection.pt')     

video_path = selecionar_video()
if not video_path:
    print("Nenhum vídeo selecionado. Saindo...")
    exit()

cap = cv2.VideoCapture(video_path)

placas_diferentes = set()

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    #Processando apenas frames multiplos de 4 para melhorar eficiencia
    frame_id = int(cap.get(cv2.CAP_PROP_POS_FRAMES)) - 1 

    if frame_id % 4 != 0:
        continue

    frame = cv2.resize(frame, None, fx=0.5, fy=0.5, interpolation=cv2.INTER_AREA)

    placas_result = placa_model(frame)

    for r in placas_result:
        boxes = r.boxes.xyxy.cpu().numpy()
        confs = r.boxes.conf.cpu().numpy()
        classes = r.boxes.cls.cpu().numpy()

        for box, conf, cls_idx in zip(boxes, confs, classes):
            x1, y1, x2, y2 = map(int, box)
            class_name = placa_model.model.names[int(cls_idx)]

            placa_crop = frame[y1:y2, x1:x2]
            if placa_crop.size == 0:
                continue

            caracteres_result = caracteres_model(placa_crop)[0]

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

            confianca = 0
            if caracteres_ordenados:
                confianca = min(c["score"] for c in caracteres_ordenados)

            if validar_formato(placa_texto, class_name) and todas_confiancas_validas:
                print(f'[VALIDO] Classe: {class_name} | Placa: {placa_texto} | Confiança mínima: {confianca}')
                cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
                cv2.putText(frame, f'{class_name}: {placa_texto}', (x1, y1 - 35),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)
                cv2.putText(frame, f'CONFIANCA: {(confianca*100):.2f}%', (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)
                placas_diferentes.add(placa_texto)

            else:
                print(f'[INVALIDO] Classe: {class_name} | Texto: {placa_texto} | Confiancas: {[round(c["score"], 2) for c in caracteres_ordenados]}')
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
                cv2.putText(frame, f'INVALIDO: {placa_texto}', (x1, y1 - 35),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                cv2.putText(frame, f'CONFIANCA: {(confianca*100):.2f}%', (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

    cv2.imshow('Detecção de Placas', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

print(f'\nPlacas diferentes detectadas: {", ".join(placas_diferentes)}')
cap.release()
cv2.destroyAllWindows()