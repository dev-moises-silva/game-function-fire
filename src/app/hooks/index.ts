export function useLine(equation: string) {
  // Regex para a forma reduzida: y = mx + b
  const retaReduzidaRegex = /^y\s*=\s*([+-]?\d*(?:\.\d+)?)x\s*([+-]?\d*(?:\.\d+)?)?$/;

  // Tentativa com a forma reduzida
  const match = equation.match(retaReduzidaRegex);
  if (match) {
    const a = parseFloat(match[1]) || 1; // Coeficiente angular m
    const b = parseFloat(match[2]) || 0; // Coeficiente linear b
    return { a, b };
  }

  return null; // Se a equação não corresponder a nenhum padrão
}

export function useCirc(equation: string) {
  // Regex para a equação da circunferência: (x - h)^2 + (y - k)^2 = r^2
  const circunferenciaRegex = /^\(x\s*([+-])\s*(\d+)\)\^2\s*\+\s*\(y\s*([+-])\s*(\d+)\)\^2\s*=\s*(\d+)\^2$/;

  const match = equation.match(circunferenciaRegex);
  if (match) {
    let h = parseFloat(match[2]);
    let k = parseFloat(match[4]);
    const r = parseFloat(match[5]);

    // Ajusta os sinais
    if (match[1] === '+') h = -h; // Se o sinal for '+', h é negativo
    if (match[3] === '+') k = -k; // Se o sinal for '+', k é negativo

    return { h, k, r };
  }

  return null; // Se a equação não corresponder ao padrão
}