import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getFirestore, collection, getDocs, addDoc, where, orderBy, limit, query, doc, deleteDoc } from 'firebase/firestore';
import { differenceInSeconds, format, formatDuration } from 'date-fns';
import Modal from '@mui/material/Modal';
import { Box, Button, Typography } from '@mui/material';
import ExcelJS from 'exceljs';

function Home() {
    const location = useLocation();
    const [userName] = useState(location.state.userName);
    const [atividade, setAtividade] = useState({});
    const [isRunning, setIsRunning] = useState(false);
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [activities, setActivities] = useState([]);
    const atividadesRef = collection(getFirestore(), 'atividades');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        checkAtividadesCollection();
        loadLastActivities();
    }, []);

    const checkAtividadesCollection = async () => {
        const querySnapshot = await getDocs(atividadesRef);
        if (querySnapshot.empty) {
            // A coleção 'atividades' não existe, criá-la
            await addDoc(atividadesRef, {});
        }
    };

    const handleOpenModal = (activity) => {
        setAtividade(activity);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const loadLastActivities = async () => {
        // Buscar as últimas 10 atividades registradas no Firebase
        const minhaConsulta = query(
            atividadesRef,
            where('nome', '==', userName),
            orderBy('data_inicio', 'desc'),
            limit(10)
        );

        const querySnapshot = await getDocs(minhaConsulta);
        const data = querySnapshot.docs.map((doc) => {
            const atividade = doc.data();
            const dataInicio = atividade.data_inicio.toDate();
            const dataFim = atividade.data_fim.toDate();

            // Calcular a diferença em segundos entre data e hora de início e data e hora de fim
            const diffInSeconds = differenceInSeconds(dataFim, dataInicio);
            return {
                ...atividade,
                id: doc.id,
                data: dataInicio,
                diffInSeconds: diffInSeconds // Adicionar a diferença em segundos aos dados da atividade
            };
        });
        setActivities(data);
    };

    const handleStartStop = () => {
        if (isRunning) {
            // Parar a contagem do tempo e salvar a atividade no Firebase
            const endTime = new Date();
            const minhaColecao = collection(getFirestore(), 'atividades');

            const dadosParaSalvar = {
                nome: userName,
                descricao: description,
                data_inicio: startTime,
                data_fim: endTime,
            };
            // Salvar a atividade no Firebase
            addDoc(minhaColecao, dadosParaSalvar)
                .then(() => {
                    // Atualizar a lista de atividades após salvar
                    loadLastActivities();
                })
                .catch((error) => {
                    console.error('Erro ao salvar atividade:', error);
                });

            // Limpar os estados
            setIsRunning(false);
            setDescription('');
            setStartTime(null);
            setElapsedTime(0);
        } else {
            // Iniciar a contagem do tempo
            setStartTime(new Date());
            setIsRunning(true);
            setElapsedTime(0);

            // Atualizar o tempo decorrido a cada segundo
            const interval = setInterval(() => {
                setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
            }, 1000);

            // Limpar o intervalo quando parar a contagem
            return () => clearInterval(interval);
        }
    };

    const formatElapsedTime = (seconds) => {
        const duration = { seconds };
        return formatDuration(duration, { format: ['hours', 'minutes', 'seconds'] }); // Formatação para exibir horas, minutos e segundos
    };

    const handleEdit = (activity) => {
        // Implementar a edição da atividade (modal, tela de edição, etc.)
        // Como isso envolve lógica adicional, deixo como um exercício para você implementar.
    };

    const handleDelete = (activity) => {
        // Abrir modal de confirmação para verificar se o usuário realmente deseja excluir a atividade
        const minhaColecao = collection(getFirestore(), 'atividades');
        const activityRef = doc(minhaColecao, activity.id); // Usar o ID do documento

        deleteDoc(activityRef)
            .then(() => {
                // Atualizar a lista de atividades após excluir
                loadLastActivities();
            })
            .catch((error) => {
                console.error('Erro ao excluir atividade:', error);
            }).finally(handleCloseModal);
    };

    const handleExportToExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Atividades');

        // Adicionar cabeçalhos das colunas
        worksheet.columns = [
            { header: 'Data', key: 'data' },
            { header: 'Hora Início', key: 'horaInicio' },
            { header: 'Hora Fim', key: 'horaFim' },
            { header: 'Descrição', key: 'descricao' },
            { header: 'Tempo Trabalhado (horas)', key: 'tempoTrabalhado' },
        ];

        // Adicionar os dados das atividades à planilha
        activities.forEach((activity) => {
            worksheet.addRow({
                data: format(activity.data, 'dd/MM/yyyy'),
                horaInicio: format(activity.data_inicio.toDate(), 'HH:mm:ss'),
                horaFim: format(activity.data_fim.toDate(), 'HH:mm:ss'),
                descricao: activity.descricao,
                tempoTrabalhado: (activity.diffInSeconds / 3600).toFixed(3),
            });
        });

        // Calcular a soma das horas trabalhadas para adicionar na última linha como "Total Horas"
        const totalHoras = activities.reduce((total, activity) => total + activity.diffInSeconds, 0) / 3600;
        worksheet.addRow({ descricao: 'Total Horas ', tempoTrabalhado: totalHoras.toFixed(3) });

        // Salvar o arquivo Excel
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'atividades.xlsx';
            a.click();
        });
    };


    return (
        <>
            <div>
                <Button onClick={handleExportToExcel}>Exportar para Excel</Button>

                <button onClick={handleStartStop}>{isRunning ? 'Parar' : 'Iniciar'}</button>
                {isRunning && (
                    <input
                        type="text"
                        placeholder="Descrição da atividade"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                )}
                {startTime && (
                    <div>
                        Tempo decorrido: {formatElapsedTime(elapsedTime)}
                    </div>
                )}
            </div>

            <h2>Últimas atividades:</h2>
            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Hora Início</th>
                        <th>Hora Fim</th>
                        <th>Descrição</th>
                        <th>Tempo Trabalhado</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {activities.map((activity) => (
                        <tr key={activity.id}>
                            <td>{format(activity.data, 'dd/MM/yyyy')}</td>
                            <td>{format(activity.data_inicio.toDate(), 'HH:mm:ss')}</td>
                            <td>{format(activity.data_fim.toDate(), 'HH:mm:ss')}</td>
                            <td>{activity.descricao}</td>
                            {/* Calcular as horas trabalhadas com base na diferença em segundos */}
                            <td>{(activity.diffInSeconds / 3600).toFixed(3)}</td>
                            <td>
                                <button onClick={() => handleEdit(activity)}>Editar</button>
                                <button onClick={() => handleOpenModal(activity)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                {/* Conteúdo do modal */}
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Tem certeza que deseja excluir esta atividade? <br />
                        Descrição da atividade: {atividade.descricao}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Esta ação não pode ser desfeita.
                    </Typography>
                    <Button onClick={() => handleDelete(atividade)}>Excluir</Button>
                    <Button onClick={handleCloseModal}>Cancelar</Button>
                </Box>
            </Modal>
        </>
    );
}

export default Home;