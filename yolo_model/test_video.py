import cv2
from tkinter import Tk, filedialog
from ultralytics import YOLO

# Função para abrir seletor de arquivos
def selecionar_video():
    root = Tk()
    root.withdraw()  # Oculta a janela principal do Tkinter
    caminho_video = filedialog.askopenfilename(title="video_placas_m", filetypes=[("Arquivos de vídeo", "*.mp4 *.avi *.mov")])
    return caminho_video

# Carregar o modelo YOLOv11 treinado
modelo = YOLO('best.pt')  # <-- Substitua pelo caminho do seu modelo treinado

# Selecionar o vídeo
video_path = selecionar_video()
if not video_path:
    print("Nenhum vídeo selecionado. Saindo...")
    exit()

# Captura de vídeo
cap = cv2.VideoCapture(video_path)

while True:
    ret, frame = cap.read()
    escala = 0.5  # 0.5 significa 50% do tamanho original
    frame = cv2.resize(frame, None, fx=escala, fy=escala, interpolation=cv2.INTER_AREA)
    if not ret:
        break

    # Inference do YOLO no frame atual
    resultados = modelo(frame)

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
