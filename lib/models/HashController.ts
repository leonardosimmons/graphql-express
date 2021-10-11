import crypto from 'crypto';

export type HashToken = {
  hashedValue: string;
  salt: string;
};

interface HashControllerInterface {
  compare(value: string, hash: HashToken): boolean;
  generateSalt(length?: number): void;
  hash(password: string, salt: string): HashToken;
  hashPassword(password: string): HashToken;
}

class HashController implements HashControllerInterface {
  public compare(value: string, hash: HashToken): boolean {
    const test: HashToken = this.hasher(value, hash.salt);

    if (test.hashedValue === hash.hashedValue) {
      return true;
    }

    return false;
  }

  public generateSalt(length?: number): string {
    if (!length) {
      length = 12;
    }

    if (length >= 15) {
      throw new Error(
        `Specified length of ${length} is greater than 15. Length must be less than 15.`,
      );
    }

    const salt: string = crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
    return salt;
  }

  public hash(value: string, salt: string): HashToken {
    return this.hasher(value, salt);
  }

  public hashPassword(password: string): HashToken {
    const salt: string = process.env.HASH_PASSWORD_SALT as string;
    return this.hash(password, salt);
  }

  private hasher(value: string, salt: string): HashToken {
    let hashedValue: string = '';
    const hash = crypto.createHmac('sha512', salt);

    if (value) {
      hash.update(value);
      hashedValue = hash.digest('hex');
    }

    return {
      salt,
      hashedValue,
    };
  }
}

export { HashController };
