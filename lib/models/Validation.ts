import { Combinable } from '../types';
import { preg_match } from '../functions';

interface ValidationInterface {
  readonly isValidated: boolean;
  readonly error: string;
  validate: () => void;
  lenCheck: (field: string, len: number) => boolean;
  check: (
    a: string,
    b: string,
    c: string,
    d: string,
    e: string,
    f: string,
    g: string,
    h: string,
    i: string,
  ) => string;
  title: (field: string, len: number) => string;
  content: (field: string, len: number) => string;
  firstname: (field: string) => string;
  lastname: (field: string) => string;
  username: (field: string) => string;
  password: (field: string) => string;
  age: (field: Combinable) => string;
  email: (field: string) => string;
}

class ValidationController implements ValidationInterface {
  private _validated: boolean;
  private _error: string;

  constructor() {
    this._validated = false;
    this._error = '';
  }

  get isValidated() {
    return this._validated;
  }

  get error() {
    return this._error;
  }

  // Controllers
  public validate(): void {
    this._validated = true;
  }

  public lenCheck(field: string, len: number): boolean {
    return field.length > len ? true : false;
  }

  public check(
    a = '',
    b = '',
    c = '',
    d = '',
    e = '',
    f = '',
    g = '',
    h = '',
    i = '',
  ): string {
    let fail: string = '';
    const checkArr: string[] = [a, b, c, d, e, f, g, h, i];

    checkArr.forEach((check) => {
      if (check !== '') {
        if (fail !== '') {
          fail = fail.concat(' | ').concat(check as string);
        } else {
          fail = check;
        }

        if (fail.match(/\s\|\s.*\s\|\s/)) {
          fail = fail.replace(' | ', '');
        }
      }
    });

    return fail;
  }

  // Functions
  public title(field: string, len: number): string {
    let fail = '';
    if (field === '') {
      fail = 'No title was entered';
    }
    if (!this.lenCheck(field, len)) {
      fail = fail + 'Title must be at least (5) characters long';
    }

    return fail;
  }

  public content(field: string, len: number): string {
    let fail = '';
    if (field === '') {
      fail = 'No contetn was entered';
    }
    if (!this.lenCheck(field, len)) {
      fail = fail + 'Content must be at least (5) characters long';
    }

    return fail;
  }

  public firstname(field: string): string {
    return field === '' ? 'No First Name was entered | ' : '';
  }

  public lastname(field: string): string {
    return field === '' ? 'No Last Name was entered | ' : '';
  }

  public username(field: string): string {
    if (field === '') return 'No Username entered. | ';
    else if (field.length < 5)
      return 'Usename must be at least 5 characters long. | ';
    else if (preg_match('W', field))
      return 'Username must only contain letters, numbers, _ and -. | ';

    return '';
  }

  public password(field: string): string {
    if (field === '') return 'No Password entered | ';
    else if (field.length < 6)
      return 'Password must be at least 6 characters long | ';
    else if (
      !preg_match('[a-z]', field) ||
      !preg_match('[A-Z]', field) ||
      !preg_match('[0-9]', field)
    )
      return 'Passwords require at least (1) uppercase letter, (1) lowercase letter and (1) number | ';

    return '';
  }

  public age(field: Combinable): string {
    if (field === '' || field === 0) return 'No Age was entered | ';
    else if (typeof field === 'string') {
      if (parseInt(field) < 21) {
        return 'You must be at least 21 years of age to enter | ';
      }
    } else if (field < 21)
      return 'You must be at least 21 years of age to enter | ';

    return '';
  }

  public email(field: string): string {
    if (field === '') return 'No Email address was entered | ';
    else if (
      !(field.indexOf('.') > 0 || field.indexOf('@') > 0) &&
      preg_match('[^a-zA-z0-9_-]', field)
    )
      return 'The entered email address is invalid | ';

    return '';
  }
}

export { ValidationController };
