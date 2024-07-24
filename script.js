
const agendamentos = {};

document.getElementById('bookingForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const service = document.getElementById('service').value;
    const duration = parseInt(document.getElementById('duration').value, 10);
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    // Convert time to minutes for easy calculation
    const [startHour, startMinute] = time.split(':').map(Number);
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = startTimeInMinutes + duration;

    // Verificar se o horário já está agendado
    if (!agendamentos[date]) {
        agendamentos[date] = [];
    }

    const isConflict = agendamentos[date].some(agendamento => {
        const [bookedStartHour, bookedStartMinute] = agendamento.time.split(':').map(Number);
        const bookedStartTimeInMinutes = bookedStartHour * 60 + bookedStartMinute;
        const bookedEndTimeInMinutes = bookedStartTimeInMinutes + parseInt(agendamento.duration, 10);

        return (startTimeInMinutes < bookedEndTimeInMinutes && endTimeInMinutes > bookedStartTimeInMinutes);
    });

    if (isConflict) {
        document.getElementById('errorMessage').textContent = 'Horário já está agendado. Escolha outro horário.';
        return;
    }

    agendamentos[date].push({ name, email, phone, service, time, duration });
    document.getElementById('errorMessage').textContent = '';

    // Atualizar visualização dos horários
    atualizarHorariosDisponiveis(date);
    atualizarClientesAgendados(date);
});

document.getElementById('date').addEventListener('change', function () {
    const date = this.value;
    atualizarHorariosDisponiveis(date);
    atualizarClientesAgendados(date);
});

function atualizarHorariosDisponiveis(date) {
    const listaHorarios = document.getElementById('listaHorarios');
    listaHorarios.innerHTML = '';

    const horariosDoDia = agendamentos[date]?.map(agendamento => ({
        start: agendamento.time,
        end: addMinutes(agendamento.time, agendamento.duration),
        name: agendamento.name
    })) || [];

    const todosHorarios = [
        { start: '08:00', end: '09:00' },
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '11:00', end: '12:00' },
        { start: '13:00', end: '14:00' },
        { start: '14:00', end: '15:00' },
        { start: '15:00', end: '16:00' },
        { start: '16:00', end: '17:00' }
    ];

    todosHorarios.forEach(horario => {
        const agendado = horariosDoDia.find(h => (h.start < horario.end && h.end > horario.start));
        const listItem = document.createElement('li');

        if (agendado) {
            listItem.textContent = `Ocupado: ${agendado.start} - ${agendado.end} (Cliente: ${agendado.name})`;
            listItem.style.color = 'red';
        } else {
            listItem.textContent = `Disponível: ${horario.start} - ${horario.end}`;
            listItem.style.color = 'green';
        }
        listaHorarios.appendChild(listItem);
    });
}

function atualizarClientesAgendados(date) {
    const listaClientes = document.getElementById('listaClientes');
    listaClientes.innerHTML = '';

    const clientesDoDia = agendamentos[date] || [];
    clientesDoDia.forEach(agendamento => {
        const listItem = document.createElement('li');
        listItem.textContent = `Nome: ${agendamento.name}, Email: ${agendamento.email}, Serviço: ${agendamento.service}, Horário: ${agendamento.time}`;
        listaClientes.appendChild(listItem);
    });
}

function addMinutes(time, minutes) {
    const [hour, minute] = time.split(':').map(Number);
    const newMinutes = hour * 60 + minute + parseInt(minutes, 10);
    const newHour = Math.floor(newMinutes / 60);
    const newMinute = newMinutes % 60;
    return `${newHour.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`;
}
document.addEventListener('DOMContentLoaded', function () {
    const clientes = {
        cliente1: { name: 'Cliente 1', email: 'cliente1@example.com', phone: '123456789' },
        cliente2: { name: 'Cliente 2', email: 'cliente2@example.com', phone: '987654321' },
        cliente3: { name: 'Cliente 3', email: 'cliente3@example.com', phone: '111222333' }
    };

    const clientSelect = document.getElementById('client');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    // Função para atualizar os campos de nome, email e telefone
    function updateClientDetails() {
        const selectedClient = clientSelect.value;
        if (clientes[selectedClient]) {
            nameInput.value = clientes[selectedClient].name;
            emailInput.value = clientes[selectedClient].email;
            phoneInput.value = clientes[selectedClient].phone;
        } else {
            nameInput.value = '';
            emailInput.value = '';
            phoneInput.value = '';
        }
    }

    // Adiciona o evento de mudança no select de cliente
    clientSelect.addEventListener('change', updateClientDetails);

    // Preenche o select com os clientes
    function populateClientSelect() {
        clientSelect.innerHTML = '<option value="">Selecione um cliente</option>';
        for (let key in clientes) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = clientes[key].name;
            clientSelect.appendChild(option);
        }
    }
    
    // JavaScript para mostrar/ocultar o formulário de adicionar cliente
    document.getElementById('addClientToggle').addEventListener('click', function () {
        const form = document.getElementById('addClientForm');
        if (form.style.display === 'none' || form.style.display === '') {
            form.style.display = 'block';
        } else {
            form.style.display = 'none';
        }
    });

    // Função para adicionar um novo cliente
    function addNewClient() {
        const newName = document.getElementById('newName').value;
        const newEmail = document.getElementById('newEmail').value;
        const newPhone = document.getElementById('newPhone').value;

        if (newName && newEmail && newPhone) {
            const newKey = 'cliente' + (Object.keys(clientes).length + 1);
            clientes[newKey] = { name: newName, email: newEmail, phone: newPhone };
            populateClientSelect();
            alert('Cliente adicionado com sucesso!');
            document.getElementById('addClientForm').reset();
        } else {
            alert('Por favor, preencha todos os campos do novo cliente.');
        }
    }

    // Adiciona o evento de clique no botão de adicionar cliente
    document.getElementById('addClientButton').addEventListener('click', addNewClient);

    // Inicializa a lista de clientes no select
    populateClientSelect();
});


async function enviarMensagemWhatsApp(phone, name, date, time, service) {
    // Aquí debes implementar la lógica para enviar el mensaje de WhatsApp


    const twilio = require('twilio');

    const accountSid = 'EUA4ff172c85327c502f00fb3fc69fcc300'; // Substitua pelo seu Account SID do Twilio
    const authToken = '2374de1dbcfc844afd76863668a16f76';   // Substitua pelo seu Auth Token do Twilio
    const client = twilio(accountSid, authToken);

    async function enviarMensagemWhatsApp(phone, name, date, time, service) {
        const mensagem = `Olá ${name}, sua consulta para o serviço ${service} está confirmada para ${date} às ${time}.`;

        try {
            const message = await client.messages.create({
                body: mensagem,
                from: 'whatsapp:+17623095512', // Número do WhatsApp gerado pelo Twilio
                to: `whatsapp:${phone}`
            });

            console.log('Mensagem enviada com sucesso:', message.sid);
        } catch (error) {
            console.error('Erro ao enviar a mensagem:', error);
        }
    }

}
