#!/usr/bin/env bash
# Shared function to detect FDK installation method
# Source this in all fdk-setup command scripts

detect_install_method() {
  # Homebrew (macOS)
  if command -v brew >/dev/null 2>&1 && brew list fdk >/dev/null 2>&1; then
    echo "homebrew"
    return 0
  fi

  # Chocolatey (Windows)
  if command -v choco >/dev/null 2>&1 && choco list --local-only fdk 2>/dev/null | grep -q "^fdk"; then
    echo "chocolatey"
    return 0
  fi

  # nvm (macOS/Linux)
  if [ -s "$HOME/.nvm/nvm.sh" ]; then
    echo "nvm"
    return 0
  fi

  # nvm-windows
  if command -v nvm >/dev/null 2>&1 && [[ "$OSTYPE" =~ ^(msys|win32|cygwin) ]]; then
    echo "nvm-windows"
    return 0
  fi

  # npm global (fallback - FDK installed but not via package manager)
  if command -v fdk >/dev/null 2>&1; then
    echo "npm-global"
    return 0
  fi

  echo "not-installed"
  return 1
}

# Usage in command scripts:
# source skills/fdk-setup/references/detect-install-method.sh
# INSTALL_METHOD=$(detect_install_method)
# echo "Installation method: $INSTALL_METHOD"
