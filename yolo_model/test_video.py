import cv2
from tkinter import Tk, filedialog
from ultralytics import YOLO

def selecionar_video():
    root = Tk()
    root.withdraw()  
    caminho_video = filedialog.askopenfilename(title="Escolher um video", filetypes=[("Arquivos de vídeo", "*.mp4 *.avi *.mov")])
    return caminho_video

modelo = YOLO('best.pt')  

video_path = selecionar_video()
if not video_path:
    print("Nenhum video selecionado. Saindo...")
    exit()

cap = cv2.VideoCapture(video_path)

while True:
    cv2.waitKey(16)
    ret, frame = cap.read()
    escala = 0.5  
    frame = cv2.resize(frame, None, fx=escala, fy=escala, interpolation=cv2.INTER_AREA)
    if not ret:
        break

    resultados = modelo(frame)

    print('Resultado: ', resultados)

    # Desenhar as detecções no frame
    anotacoes = resultados[0].plot()

    # Mostrar o frame com as detecções
    cv2.imshow('Detecção de Placas - YOLOv11', anotacoes)

    # Sair com a tecla 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Libera recursos
cap.release()
cv2.destroyAllWindows()
