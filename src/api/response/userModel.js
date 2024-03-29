import { v4 as uuidv4 } from 'uuid';
import generatePassword from '../../../../utils/generatePassword';
import { IMAGE_URL } from '../../../../constants/images';
import moment from 'moment/moment';

class UserModel {
  constructor(user) {
    this.id = user.id || uuidv4();
    this.fullName = user.fullName;
    this.email = user.email;
    this.password = user.password || generatePassword();
    this.country = user.country;
    this.state = user.state;
    this.address = user.address;
    this.phone = user.phone;
    this.dayOfBirth = user.dayOfBirth || '2023-01-01';
    this.gender = user.gender || 'female';
    this.order = user.order || 0;
    this.spent = user.spent || 0;
    this.avatar = user.avatar || IMAGE_URL.AVATAR_DEFAULT;
    this.isPublic = user.isPublic || true;
    this.createdAt = user.createdAt || moment().format();
  }
}

export default UserModel;
