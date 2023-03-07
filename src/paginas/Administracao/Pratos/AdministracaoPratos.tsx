import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import http from "../../../http";
import IPrato from "../../../interfaces/IPrato";
import IRestaurante from "../../../interfaces/IRestaurante";

const AdministracaoPratos = () => {

    const [pratos, setPratos] = useState<IPrato[]>([]);
    const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);

    useEffect(() => {
        Promise.all([
            http.get<IPrato[]>('pratos/'),
            http.get<IRestaurante[]>(`restaurantes/`)
        ]
        ).then(([pratos, restaurantes]) => {
            setPratos(pratos.data);
            setRestaurantes(restaurantes.data);
        }).catch(ex => console.log(ex));
    }, []);

    const excluirPrato = (pratoASerExcluido: IPrato) => {
        http.delete(`pratos/${pratoASerExcluido.id}/`)
            .then(() => {
                const listaPratos = pratos.filter(prato => prato.id !== pratoASerExcluido.id);
                setPratos([...listaPratos]);
            })
    }

    const obterRestaurante = (id: number) => {
        const padrao: IRestaurante = {
            id: 0,
            nome: '',
            pratos: []
        };

        const result = restaurantes.filter(restaurante => restaurante.id === id);
        if (result.length > 0) {
            return result[0];
        } else {
            return padrao;
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Nome
                        </TableCell>
                        <TableCell>
                            Restaurante
                        </TableCell>
                        <TableCell>
                            Tag
                        </TableCell>
                        <TableCell>
                            Imagem
                        </TableCell>
                        <TableCell>
                            Editar
                        </TableCell>
                        <TableCell>
                            Deletar
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pratos.map(prato =>
                        <TableRow key={prato.id}>
                            <TableCell>
                                {prato.nome}
                            </TableCell>
                            <TableCell>
                                {obterRestaurante(prato.restaurante).nome}
                            </TableCell>
                            <TableCell>
                                {prato.tag}
                            </TableCell>
                            <TableCell>
                                <a href={prato.imagem} target="_blank" rel="noreferrer">ver imagem</a>
                            </TableCell>
                            <TableCell>
                                [ <Link to={`/admin/pratos/${prato.id}`}>editar</Link> ]
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => excluirPrato(prato)}
                                >
                                    Deletar
                                </Button>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );

};

export default AdministracaoPratos;
