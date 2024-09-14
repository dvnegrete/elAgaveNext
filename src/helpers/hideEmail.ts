export function hideEmail(email:string) {
    const arrPartsEmail = email.split("@");
    const firstPart = arrPartsEmail[0];
    const large = firstPart.length;
    const arrayAssambleFirstPart = [firstPart[0]];
    const lastPart = firstPart[large - 1];
  
    let cycle = large - 2;
    while (cycle != 0) {
      arrayAssambleFirstPart.push("*");
      cycle--;
    }
    arrayAssambleFirstPart.push(lastPart);
    const assambleFirstPart = arrayAssambleFirstPart.toString().replace(/,/g, "");
    const assambleEmail = assambleFirstPart + "@" + arrPartsEmail[1];
    return assambleEmail;
  }