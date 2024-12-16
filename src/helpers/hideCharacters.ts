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

  export function hideCharactersPhone(phone: string) {
    const large = phone.length;
    const penultimatePart = phone[large - 2];
    const lastPart = phone[large - 1];
    const arrayPhone = ["*"];
  
    let cycle = large - 3;
    let pair = true;
    while (cycle != 0) {
      arrayPhone.push("*");
      if (pair) {
        arrayPhone.push(" ");
      }
      pair = !pair;
      cycle--;
    }
    arrayPhone.push(penultimatePart);
    arrayPhone.push(lastPart);
    const assamblePhone = arrayPhone.toString().replace(/,/g, "");
    return assamblePhone;
  }