import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../../../http";
import IPrato from "../../../interfaces/IPrato";
import IRestaurante from "../../../interfaces/IRestaurante";
import ITag from "../../../interfaces/ITag";


const FormularioPratos = () => {

    const parametros = useParams();

    useEffect(() => {
        if (parametros.id) {
            http.get<IPrato>(`pratos/${parametros.id}/`)
                .then(response => {
                    setNomePrato(response.data.nome);
                    setDescricao(response.data.descricao);
                    setTag(response.data.tag);
                    setRestaurante(String(response.data.restaurante));
                })
                .catch(ex => {
                    console.log(ex);
                });
        }

    }, [parametros]);

    const [nomePrato, setNomePrato] = useState('');
    const [descricao, setDescricao] = useState('');

    const [tags, setTags] = useState<ITag[]>([]);
    const [tag, setTag] = useState('');

    const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
    const [restaurante, setRestaurante] = useState('');

    const [imagem, setImagem] = useState<File | null>(null);

    const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
        evento.preventDefault();

        const formData = new FormData();
        formData.append('nome', nomePrato);
        formData.append('descricao', descricao);
        formData.append('tag', tag);
        formData.append('restaurante', restaurante);

        if (imagem) {
            formData.append('imagem', imagem);
        }

        let url = 'pratos/';
        let method = 'POST';
        let mensagem = 'Prato cadastrado com sucesso!';
        if (parametros.id) {
            url = `pratos/${parametros.id}/`;
            method = 'PUT';
            mensagem = 'Prato alterado com sucesso!';
        }

        http.request({
            url: url,
            method: method,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        }).then(resposta => {
            limpaFormulario();
            alert(mensagem);
        })
            .catch(erro => console.log(erro));

    }

    const limpaFormulario = () => {
        setNomePrato('');
        setDescricao('');
        setTag('');
        setRestaurante('');
        setImagem(null);
    };

    const selecionarArquivo = (evento: React.ChangeEvent<HTMLInputElement>) => {
        if (evento.target.files?.length) {
            setImagem(evento.target.files[0]);
        } else {
            setImagem(null);
        }
    }

    useEffect(() => {
        http.get<{ tags: ITag[] }>('tags/')
            .then(response => {
                setTags(response.data.tags);
            });

        http.get<IRestaurante[]>('restaurantes/')
            .then(response => {
                setRestaurantes(response.data);
            });

    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
            <Typography component="h1" variant="h6">Formulário de Pratos</Typography>
            <Box component="form" sx={{ width: '100%' }} onSubmit={aoSubmeterForm}>
                <TextField
                    value={nomePrato}
                    onChange={evento => setNomePrato(evento.target.value)}
                    label="Nome do prato"
                    variant="standard"
                    fullWidth
                    required
                    margin="dense"
                />
                <TextField
                    value={descricao}
                    onChange={evento => setDescricao(evento.target.value)}
                    label="Descrição do prato"
                    variant="standard"
                    fullWidth
                    required
                    margin="dense"
                />

                <FormControl margin="dense" fullWidth>
                    <InputLabel id="select-tag">Tag</InputLabel>
                    <Select labelId="select-tag" value={tag} onChange={evento => setTag(evento.target.value)}>
                        {tags.map(tag => <MenuItem key={tag.id} value={tag.value}>
                            {tag.value}
                        </MenuItem>)}
                    </Select>
                </FormControl>

                <FormControl margin="dense" fullWidth>
                    <InputLabel id="select-restaurante">Restaurante</InputLabel>
                    <Select labelId="select-restaurante" value={restaurante} onChange={evento => setRestaurante(evento.target.value)}>
                        {restaurantes.map(restaurante => <MenuItem key={restaurante.id} value={restaurante.id}>
                            {restaurante.nome}
                        </MenuItem>)}
                    </Select>
                </FormControl>

                <input type="file" onChange={selecionarArquivo} />

                <Button sx={{ marginTop: 1 }}
                    type="submit" fullWidth variant="outlined">Salvar</Button>
            </Box>
        </Box>
    );

}

export default FormularioPratos;