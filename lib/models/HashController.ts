import crypto from 'crypto';

export type HashToken = {
  hash: string;
  salt: string;
};

interface HashControllerInterface {
  compare(value: string, hash: HashToken): boolean;
  hash(value: string): HashToken;
}

class HashController implements HashControllerInterface {
  public compare(value: string, token: HashToken): boolean {
    const test: HashToken = this.hasher(value, token.salt);

    if (test.hash === token.hash) {
      return true;
    }

    return false;
  }

  public hash(value: string, salt?: string): HashToken {
    return this.hasher(value, salt);
  }

  private generateSalt(): string {
    return crypto.randomBytes(16).toString('base64');
  }

  private hasher(value: string, salt?: string): HashToken {
    const s: string = (salt as string) || this.generateSalt();
    const hash: string = crypto
      .createHmac('sha512', s)
      .update(value)
      .digest('base64');
    return {
      hash,
      salt: s,
    };
  }
}

export { HashController };
