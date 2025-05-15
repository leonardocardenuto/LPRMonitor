#!/bin/bash

# =============================
# CONFIGURAÇÕES INICIAIS
# =============================

BACK_DIR="flask_back"
BACK_DIR_ABS="$(realpath "$BACK_DIR")"
YOLO_DIR="yolo_model"
YOLO_DIR_ABS="$(realpath "$YOLO_DIR")"
VENV_DIR="$BACK_DIR_ABS/.venv"
REQUIREMENTS_FILE="$BACK_DIR_ABS/requirements.txt"
OS="$(uname -s)"

# =============================
# FUNÇÕES AUXILIARES
# =============================

log_info()    { echo -e "\033[1;36mℹ️ $1\033[0m"; }
log_success() { echo -e "\033[1;32m✅ $1\033[0m"; }
log_warn()    { echo -e "\033[1;33m⚠️ $1\033[0m"; }
log_error()   { echo -e "\033[1;31m❌ $1\033[0m"; }

activate_venv() {
  if [[ "$OS" == "Linux" || "$OS" == "Darwin" ]]; then
    source "$VENV_DIR/bin/activate"
  elif [[ "$OS" == "MINGW"* || "$OS" == "CYGWIN"* || "$OS" == "MSYS"* ]]; then
    source "$VENV_DIR/Scripts/activate"
  else
    log_error "Sistema não suportado automaticamente. Ative o .venv manualmente."
    exit 1
  fi
}

set_flask_env() {
  case "$FLASK_ENV" in
    development)
      export FLASK_APP="dev"
      ;;
    production)
      export FLASK_APP="run"
      ;;
    *)
      log_error "FLASK_ENV inválido (use development ou production)"
      exit 1
      ;;
  esac
}

check_production() {
  if [[ "$FLASK_ENV" == "production" ]]; then
    log_warn "Comando não suportado em PRODUCTION. Execute em DEVELOPMENT."
    exit 1
  fi
}

# =============================
# COMANDOS
# =============================

install_deps() {
  [ ! -d "$VENV_DIR" ] && log_info "Criando ambiente virtual..." && python3 -m venv "$VENV_DIR"
  activate_venv
  log_info "Instalando dependências..."
  pip install -r "$REQUIREMENTS_FILE"
  log_success "Dependências instaladas."
}

add_dependency() {
  local pkg="$1"
  if [[ -z "$pkg" ]]; then
    log_error "Você precisa passar o nome do pacote."
    return 1
  fi

  activate_venv

  if grep -iq "^$pkg" "$REQUIREMENTS_FILE"; then
    log_warn "Dependência '$pkg' já está no requirements.txt."
    return 1
  fi

  log_info "Instalando $pkg..."
  pip install "$pkg"
  pip freeze | grep -i "^$pkg" >> "$REQUIREMENTS_FILE"
  log_success "Pacote '$pkg' instalado e salvo no requirements.txt."
}

remove_dependency() {
  local pkg="$1"
  if [[ -z "$pkg" ]]; then
    log_error "Você precisa passar o nome do pacote."
    return 1
  fi

  activate_venv

  if ! grep -iq "$pkg" "$REQUIREMENTS_FILE"; then
    log_warn "Pacote '$pkg' não encontrado no requirements.txt."
    return 1
  fi

  sed -i "/$pkg/d" "$REQUIREMENTS_FILE"
  pip uninstall -y "$pkg"
  log_success "Pacote '$pkg' removido do requirements.txt e desinstalado."
}

run_app() {
  activate_venv
  local script_name

  if [[ "$FLASK_ENV" == "production" ]]; then
    script_name="run.py"
    log_info "Rodando app em modo PRODUCTION..."
  else
    script_name="dev.py"
    log_info "Rodando app em modo DEVELOPMENT..."
  fi

  (cd "$BACK_DIR_ABS" && export PYTHONPATH="$BACK_DIR_ABS:$PYTHONPATH" && python "$script_name")
}

run_yolo() {
  activate_venv
  log_info "Rodando YOLO..."
  (cd "$YOLO_DIR_ABS" && export PYTHONPATH="$YOLO_DIR_ABS:$PYTHONPATH" && python test.py)
}

migrate_db() {
  check_production
  activate_venv
  log_info "Executando migrações..."
  (cd "$BACK_DIR_ABS" && export PYTHONPATH="$BACK_DIR_ABS:$PYTHONPATH" && flask db migrate -m "auto migration" && flask db upgrade)
  log_success "Migrações aplicadas."
}

show_routes() {
  check_production
  activate_venv
  log_info "Rotas registradas:"
  (cd "$BACK_DIR_ABS" && export PYTHONPATH="$BACK_DIR_ABS:$PYTHONPATH" && flask routes)
}

print_help() {
  echo -e "\n\033[1;34mUso: ./lpr [comando]\033[0m"
  echo -e "\033[1;36mComandos disponíveis:\033[0m"
  echo -e "  \033[1;33mrun\033[0m       - Roda a aplicação"
  echo -e "  \033[1;36mmigrate\033[0m   - Cria e aplica migrations"
  echo -e "  \033[1;32mroutes\033[0m    - Mostra rotas Flask"
  echo -e "  \033[1;32mpip\033[0m       - Instala dependências do requirements.txt"
  echo -e "  \033[1;36madd [pacote]\033[0m    - Adiciona pacote ao requirements.txt"
  echo -e "  \033[1;36mremove [pacote]\033[0m - Remove pacote do requirements.txt\n"
}

# =============================
# EXECUÇÃO PRINCIPAL
# =============================

# Garante que está no diretório raiz
if [ ! -d "$BACK_DIR" ]; then
  log_error "Diretório '$BACK_DIR' não encontrado. Verifique o caminho."
  exit 1
fi

# Garante que requirements.txt existe
mkdir -p "$BACK_DIR_ABS"
touch "$REQUIREMENTS_FILE"

# Carrega .env se existir
[ -f "$BACK_DIR_ABS/.env" ] && export $(grep -v '^#' "$BACK_DIR_ABS/.env" | xargs)

# Define o FLASK_APP
set_flask_env

# Roteia os comandos
case "$1" in
  run) run_app ;;
  yolo) run_yolo ;;
  migrate) migrate_db ;;
  routes) show_routes ;;
  pip) install_deps ;;
  add) add_dependency "$2" ;;
  remove) remove_dependency "$2" ;;
  *) print_help ;;
esac
