import User from '../models/User';
import * as Yup from 'yup';
import File from '../models/File';

class UserController {
  async store(req, res){

//---------------------------------------------------------------------------------------------
    const schemaName = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schemaName.isValid(req.body))) {
      return res.status(400).json({ error: 'Name validation fails' });
    }
  //---------------------------------------------------------------------------------------------
    const schemaEmail = Yup.object().shape({
      email: Yup.string().required(),
    });

    if (!(await schemaEmail.isValid(req.body))) {
      return res.status(400).json({ error: 'Email validation fails' });
    }
  //----------------------------------------------------------------------------------------------
  
  function checkCPF(str){
    const regex = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/;
    return regex.test(String(str).toLowerCase());
  }

    const schemaCpf = Yup.object().shape({
      cpf: Yup.string().required(),
    });

    if (!(await schemaCpf.isValid(req.body))) {
      return res.status(400).json({ error: 'CPF validation fails' });
    }

    if (!(await checkCPF(req.body.cpf))){
      return res.status(400).json({ error: 'Invalid CPF' });
    }
    
    const userExists = await User.findOne({ where: { email : req.body.email } });

    if (userExists){
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const { id, name, email, cpf, birth, contact, points } = await User.create(req.body);

    return res.json({
      id, 
      name, 
      email,
      cpf, 
      birth, 
      contact,
      points
    });
  }

  async update(req, res) {

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.string(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().min(6).when('oldPassword', (oldPassword, field) => 
        oldPassword ? field.required(): field
      ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      )
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.user_id);

    if (email && email != user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists){
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "Password does not match" });
    }

    const { id, name, cpf, birth, contact, avatar_id, points } = await user.update(req.body);

    return res.json({
      id, 
      name, 
      email,
      cpf, 
      birth, 
      contact,
      avatar_id,
      points
    });
  }

  async index(req, res) {
    const users = await User.findAll({
      //where: { points: 0 },
      //where: { points: 1 },
      attributes: ['id', 'name', 'email', 'points'],
      include: [
        {
          model: File,
          attributes: ['name', 'path', 'url'],
          as: 'avatar'
        }
      ],
    });

    if (users < 1){
      return res.status(400).json({ error: 'No users registered' });
    }

    return res.json(users);
  }
}

export default new UserController();