import { useEffect, useState } from 'react';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
import axios, { AxiosRequestConfig } from 'axios';
import { IPaginacao } from '../../interfaces/IPaginacao';

interface IParametrosBusca {
  ordering?: string,
  search?: string
}

const ListaRestaurantes = () => {

  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState('');

  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('');

  useEffect(() => {
    //obter restaurantes
    carregarDados('http://localhost:8000/api/v1/restaurantes/');
  }, []);

  const carregarDados = (url: string, opcoes: AxiosRequestConfig = {}) => {
    axios.get<IPaginacao<IRestaurante>>(url, opcoes)
      .then(response => {
        setRestaurantes(response.data.results);
        setProximaPagina(response.data.next);
      })
      .catch(erro => {
        console.log(erro);
      });
  }

  const verMais = () => {
    axios.get<IPaginacao<IRestaurante>>(proximaPagina)
      .then(response => {
        setRestaurantes([...restaurantes, ...response.data.results]);
        setProximaPagina(response.data.next);
      })
      .catch(erro => {
        console.log(erro);
      });
  };

  const buscar = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const opcoes = {
      params: {

      } as IParametrosBusca
    }

    if (busca) {
      opcoes.params.search = busca;
    }

    if (ordenacao) {
      opcoes.params.ordering = ordenacao;
    }

    carregarDados('http://localhost:8000/api/v1/restaurantes/', opcoes);
  }

  return (
    <section className={style.ListaRestaurantes}>
      <h1>Os restaurantes mais <em>bacanas</em>!</h1>
      <form onSubmit={buscar}>
        <select 
          name="select-ordenacao"
          id="select-ordenacao"
          value={ordenacao}
          onChange={evento => setOrdenacao(evento.target.value)}
          >          
          <option value=""></option>
          <option value="id">id</option>
          <option value="nome">nome</option>
        </select>
        <input type="text" value={busca} onChange={evento => setBusca(evento.target.value)} />
        <button type='submit'>buscar</button>
      </form>
      {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}
      {proximaPagina &&
        <button onClick={verMais}>
          ver mais
        </button>}
    </section>
  );
}

export default ListaRestaurantes