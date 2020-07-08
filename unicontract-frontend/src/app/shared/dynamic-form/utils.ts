export function evalStringExpression(expression: string, argNames: string[]) {
    try {
      return Function(...argNames, `return ${expression};`) as any;
    } catch (error) {
      console.error(error);
    }
  }
  
  export function evalExpressionValueSetter(expression: string, argNames: string[]) {
    try {
      return Function(...argNames, `${expression} = expressionValue;`) as (value: any) => void;
    } catch (error) {
      console.error(error);
    }
  }
  
  export function evalExpression(expression: string | Function | boolean, thisArg: any, argVal: any[]): any {
    if (expression instanceof Function) {
      return expression.apply(thisArg, argVal);
    } else {
      return expression ? true : false;
    }
  }

  export function toInteger(value: any): number {
    return parseInt(`${value}`, 10);
  }
  
  export function toString(value: any): string {
    return (value !== undefined && value !== null) ? `${value}` : '';
  }
  
  export function getValueInRange(value: number, max: number, min = 0): number {
    return Math.max(Math.min(value, max), min);
  }
  
  export function isString(value: any): value is string {
    return typeof value === 'string';
  }
  
  export function isNumber(value: any): value is number {
    return !isNaN(toInteger(value));
  }
  
  export function isInteger(value: any): value is number {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  }
  
  export function isDefined(value: any): boolean {
    return value !== undefined && value !== null;
  }
  
  export function padNumber(value: number) {
    if (isNumber(value)) {
      return `0${value}`.slice(-2);
    } else {
      return '';
    }
  }
  
  export function regExpEscape(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
  
  export function hasClassName(element: any, className: string): boolean {
    return element && element.className && element.className.split &&
        element.className.split(/\s+/).indexOf(className) >= 0;
  }

  export function annoAccademicoCorrente(): string {
    let date = new Date();
    //(now()->month <= 10) ? now()->year-1 : now()->year //anno accademico
    return (date.getMonth() <= 10 ? date.getFullYear() - 1 : date.getFullYear()).toString();
  }

  /**
 * Verifica validità del codice di controllo del codice fiscale.
 * Il valore vuoto è "valido" per semplificare la logica di verifica
 * dell'input, assumendo che l'eventuale l'obbligatorietà del campo
 * sia oggetto di un controllo e retroazione distinti.
 * Per aggiornamenti e ulteriori info v. http://www.icosaedro.it/cf-pi 
 * @param string cf Codice fiscale da controllare.
 * @return string Stringa vuota se il codice di controllo è
 * corretto oppure il valore è vuoto, altrimenti un messaggio
 * che descrive perché il valore non può essere valido.
 */
export function ControllaCF(cf)
{
	cf = cf.toUpperCase();
	if( cf == '' )  return '';
	if( ! /^[0-9A-Z]{16}$/.test(cf) )
		return "Il codice fiscale deve contenere 16 tra lettere e cifre.";
	var map = [1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 1, 0, 5, 7, 9, 13, 15, 17,
		19, 21, 2, 4, 18, 20, 11, 3, 6, 8, 12, 14, 16, 10, 22, 25, 24, 23];
	var s = 0;
	for(var i = 0; i < 15; i++){
		var c = cf.charCodeAt(i);
		if( c < 65 )
			c = c - 48;
		else
			c = c - 55;
		if( i % 2 == 0 )
			s += map[c];
		else
			s += c < 10? c : c - 10;
	}
	var atteso = String.fromCharCode(65 + s % 26);
	if( atteso != cf.charAt(15) )
		return "Il codice fiscale non è valido:\n" +
			"il codice di controllo non corrisponde.\n";
	return "";
}

/**
 * Verifica validità del codice di controllo della partita IVA.
 * Il valore vuoto è "valido" per semplificare la logica di verifica
 * dell'input, assumendo che l'eventuale l'obbligatorietà del campo
 * sia oggetto di un controllo e retroazione distinti.
 * Per aggiornamenti e ulteriori info v. http://www.icosaedro.it/cf-pi 
 * @param string pi Partita IVA da controllare.
 * @return string Stringa vuota se il codice di controllo è
 * corretto oppure il valore è vuoto, altrimenti un messaggio
 * che descrive perché il valore non può essere valido.
 */
export function ControllaPIVA(pi)
{
	if( pi == '' )  return '';
	if( ! /^[0-9]{11}$/.test(pi) )
		return "La partita IVA deve contenere 11 cifre.";
	var s = 0;
	for( i = 0; i <= 9; i += 2 )
		s += pi.charCodeAt(i) - '0'.charCodeAt(0);
	for(var i = 1; i <= 9; i += 2 ){
		var c = 2*( pi.charCodeAt(i) - '0'.charCodeAt(0) );
		if( c > 9 )  c = c - 9;
		s += c;
	}
	var atteso = ( 10 - s%10 )%10;
	if( atteso != pi.charCodeAt(10) - '0'.charCodeAt(0) )
		return "La partita IVA non è valida:\n" +
			"il codice di controllo non corrisponde.\n";
	return '';
}


