const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001; // Choose a suitable port
const cors = require('cors'); 

app.use(express.json());
app.use(cors());

app.get("/", (req,res)=> {
  const htmlResponse = `<html><head><title>hola</title></head><body><h1>Soy un proyecto en Versel</h1></body></html>`
  res.send(htmlResponse);
})

app.post('/send-whatsapp-message', async (req, res) => {
  try {
    // Replace these placeholders with your actual values
    const urlBase = 'http://localhost:5173/';
    const fromPhoneNumberId = '158645557327099';
    const accessToken =
      'EAFb2W9aC9GkBO4NMtCHWDapP4H89sccjxfn4fl4ZB1jLxnM7UMTrVemz7cEDWXTZANVHuuG4dlCDQQl7BMDK2Nudz1rYmzc99FROjJ52GuyYCB2ZAlzchbF6nDLTV1cFv8fcRSjAjhpoow0gR7WgWka0rZCK0B22knQpswwRLE5oe3ueGtL5mFOQgfXKVhZAKS7zRSMi0apyg1oJg';
    const recipientPhoneNumber = req.body.recipientPhoneNumber;
    const shift = req.body.shift;
    const professional = req.body.professional;
    const templateName = req.body.confirmationType === 'client' ? 'shift_confirmation_client':'turnos';
    const urlToConfirm = urlBase + req.body.confirmationType === 'client' ? 'confirmar-turno-client/':'confirmar-turno-profesional/';
    console.log("body", req.body);

    const url = `https://graph.facebook.com/v18.0/${fromPhoneNumberId}/messages`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    const data = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: '542234215869',
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: 'es_AR',
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: `${shift.shifDate} a las ${shift.time}`,
              },
              {
                type: 'text',
                text: `${professional.firstName} ${professional.lastName}`,
              },
              {
                type: 'text',
                text: `${urlToConfirm}${shift.id}`,
              },
            ],
          },
        ],
      },
    };

    // Send the WhatsApp message
    const response = await axios.post(url, data, { headers });

    console.log('Message sent successfully:', response.data);
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

