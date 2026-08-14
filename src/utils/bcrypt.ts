import bcrypt from "bcrypt";

export const hashPassword = (password: string): Promise<string> => {
  return new Promise((res, rej) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        rej(err);
        return;
      }
      res(hash);
    });
  });
};

export const comparePassword = (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return new Promise((res, rej) => {
    bcrypt.compare(password, hashedPassword, (err, result) => {
      if (err) {
        rej(err);
        return;
      }
      res(result);
    });
  });
};
