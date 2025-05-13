import cv2
from ultralytics import YOLO
import easyocr
from tkinter import Tk, filedialog

def selecionar_video():
    root = Tk()
    root.withdraw()
    caminho_video = filedialog.askopenfilename(title="Selecione um vídeo", filetypes=[("Arquivos de vídeo", "*.mp4 *.avi *.mov")])
    return caminho_video

modelo = YOLO('../yolo_model/best.pt')  

reader = easyocr.Reader(['pt', 'en'])

video_path = selecionar_video()
if not video_path:
    print("Nenhum vídeo selecionado. Saindo...")
    exit()

cap = cv2.VideoCapture(video_path)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    escala = 0.5
    frame = cv2.resize(frame, None, fx=escala, fy=escala, interpolation=cv2.INTER_AREA)

    results = modelo(frame)

    for r in results: 
        boxes = r.boxes.xyxy.cpu().numpy()  # Bounding boxes (x1, y1, x2, y2)
        for box in boxes:
            x1, y1, x2, y2 = map(int, box)

            placa_crop = frame[y1:y2, x1:x2]

            ocr_result = reader.readtext(placa_crop)

            for (bbox, text, conf) in ocr_result:
                print(f'Texto detectado: {text} - Confiança: {conf:.2f}')

                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, text, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

    cv2.imshow('Detecção de Placas + OCR', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
