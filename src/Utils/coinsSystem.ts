export function calcularCoinsGanho(
    baseCoins: number,
    primeraVez: boolean,
) : number {
    if (primeraVez){
      return Math.floor(baseCoins * 0.2);
    } 
    return baseCoins;
}