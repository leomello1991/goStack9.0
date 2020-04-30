// importar propriedades multer e crypto e a resolve e extensao do arquivo
import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

// exporta arquivo de configuração do armazenamento dos avatares

export default {
  storage: multer.diskStorage({
    // coloc o caminho onde ta salvo meus avatares
    destination: resolve(__dirname, '..', '..', 'temp', 'uploads'),
    // para o nome do arquivo como pode o usuario colocar qlq um crio uma funçao onde pega a requisição o arquivo e
    // faço uma callback
    filename: (req, file, cb) => {
      // gera um arquivo com bytes aleatorios  e chamo  callback onde passo erro e resultad
      crypto.randomBytes(16, (err, res) => {
        // se der erro retorno a calback passda como parametro e coloco erro dentro dela
        if (err) return cb(err);
        // se nao der erro retorno a calback passando minha resposta do crypto.randomBytes como hexadecimal
        // e concateno com a extencçao do arquivo ficando tipo assim f12oe2k4foe.png ou 54eg4rg6r1.jpeg
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
