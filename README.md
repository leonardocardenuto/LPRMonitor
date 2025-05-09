# License Plate Recognition (LPR)

## Descrição
Este projeto é um sistema de **reconhecimento de placas de veículos** usando inteligência artificial, integrado com câmeras de segurança. O objetivo é permitir o monitoramento do acesso de veículos em propriedades de forma acessível e eficiente.

## Tecnologias Utilizadas

- **Backend:** Python, Flask
- **Frontend:** ReactJS, Typescript
- **Banco de Dados:** NeonDB (compatível com PostgreSQL)
- **Inteligência Artificial:** YOLO (detecção de objetos) e OCR (reconhecimento de texto)
- **Ferramentas:** GitHub, Trello, Postman, Figma, Roboflow, CVAT

## Como Rodar o Projeto

### 1. Clonar o Repositório
```bash
git clone https://github.com/leonardocardenuto/LPRMonitor.git
cd LPRMonitor
```
> Nota: Certificar-se de ter configurado o arquivo .env como especificado no .env.example.

### 2. Configurar o Backend

- Tornar executável o nosso cli personalizado
```bash
chmod +x ./lpr
```

> Nota: No Windows, certifique-se de rodar o projeto em um terminal Bash (por exemplo, no VSCode ou usando o WSL - Windows Subsystem for Linux).

- Instalar as dependências
```bash
./lpr pip
```
- Rodar o backend
```bash
./lpr run
```

### ⚠️  
### Para testar o modelo:
#### • Crie e ative um ambiente virtual
```bash
python -m venv venv
venv/Scripts/activate  # No Windows
```
#### ou
```bash
source venv/bin/activate  # No Linux/macOS
```

#### • Instale as dependências necessárias
```bash
pip install ultralytics
```

#### • Execute o script de teste
```bash
python test.py
```
