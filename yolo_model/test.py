from ultralytics import YOLO
import cv2

imagem_caminho = "image_test.png"  

modelo = YOLO("best.pt")

resultados = modelo.predict(source=imagem_caminho, show=True, conf=0.5)

for resultado in resultados:
    resultado.save(filename="test_result.jpg")
    
    for resultado in resultados:
      caixas = resultado.boxes  
      nomes_classes = resultado.names  

    for box in caixas:
        cls_id = int(box.cls[0])  
        conf = float(box.conf[0])  

        print(f"Objeto detectado: {nomes_classes[cls_id]}")
        print(f"Confiança: {conf:.2f}")
        print("---")

print("Detecção concluída.")