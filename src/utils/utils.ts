const bcrypt = require('bcrypt');

export async function hashPassword(password: string): Promise<string> {

  const saltRounds = 9;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function(err: any, hash: string) {
      if (err) reject(err)
      resolve(hash)
    });
  })

  return hashedPassword as string;
}


export async function comparePassword(enteredPassword: string, hashedPassword: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(enteredPassword, hashedPassword, function(err: Error, result: boolean) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
