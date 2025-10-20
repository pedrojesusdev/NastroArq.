# Configuração do Google Sheets para Receber Dados do Formulário

## Passo 1: Preparar a Planilha

1. Abra sua planilha do Google Sheets: 
   https://docs.google.com/spreadsheets/d/178w-JxHgrEscy152xACejKjAk7WWhIU4QCLxjQafiuw/edit

2. Crie as seguintes colunas na primeira linha (A1 até F1):
   - **A1**: Timestamp
   - **B1**: Nome
   - **C1**: Email
   - **D1**: Telefone
   - **E1**: Mensagem
   - **F1**: Status (opcional - para marcar como "Lido", "Respondido", etc.)

## Passo 2: Criar o Google Apps Script

1. Na planilha, clique em **Extensões** > **Apps Script**

2. Apague o código existente e cole o seguinte código:

```javascript
function doPost(e) {
  try {
    // Obtém a planilha ativa
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse dos dados recebidos
    var data = JSON.parse(e.postData.contents);
    
    // Prepara os dados para inserir
    var timestamp = new Date(data.timestamp);
    var name = data.name;
    var email = data.email;
    var phone = data.phone;
    var message = data.message;
    
    // Adiciona uma nova linha com os dados
    sheet.appendRow([
      timestamp,
      name,
      email,
      phone,
      message,
      "Novo" // Status inicial
    ]);
    
    // Retorna sucesso
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'success',
        'message': 'Dados salvos com sucesso'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Retorna erro
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'error',
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Função de teste (opcional)
function testPost() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        name: "Teste Nome",
        email: "teste@email.com",
        phone: "(11) 99999-9999",
        message: "Mensagem de teste"
      })
    }
  };
  
  var result = doPost(testData);
  Logger.log(result.getContent());
}
```

3. Clique em **Salvar** (ícone de disquete) e dê um nome ao projeto (ex: "Formulário Contato")

## Passo 3: Implantar o Script

1. Clique em **Implantar** > **Nova implantação**

2. Clique no ícone de engrenagem ⚙️ ao lado de "Selecionar tipo" e escolha **Aplicativo da web**

3. Configure:
   - **Descrição**: "Webhook Formulário de Contato"
   - **Executar como**: Eu (seu email)
   - **Quem tem acesso**: Qualquer pessoa

4. Clique em **Implantar**

5. Autorize o acesso quando solicitado (pode aparecer um aviso de segurança - clique em "Avançado" e depois "Ir para [nome do projeto]")

6. **COPIE A URL** que aparece (algo como: https://script.google.com/macros/s/xxxxx/exec)

## Passo 4: Configurar no Código do Site

1. Abra o arquivo `src/pages/Contact.tsx`

2. Procure pela linha:
   ```typescript
   const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```

3. Substitua `'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'` pela URL que você copiou no Passo 3

4. Salve o arquivo

## Passo 5: Testar

1. Acesse a página de contato do seu site

2. Preencha o formulário com dados de teste

3. Clique em "Enviar Mensagem"

4. Verifique se os dados aparecem na planilha do Google Sheets

## Troubleshooting (Solução de Problemas)

### Os dados não estão aparecendo na planilha?

1. **Verifique se a URL está correta**: A URL deve terminar com `/exec`

2. **Teste o script diretamente**:
   - No Apps Script, clique em "Executar" > "testPost"
   - Verifique se os dados de teste aparecem na planilha

3. **Verifique as permissões**:
   - O script deve ter permissão para acessar a planilha
   - A planilha não deve estar protegida

4. **Veja os logs do Apps Script**:
   - No Apps Script, vá em "Execuções"
   - Veja se há erros registrados

### Mensagem "Erro ao enviar"?

1. Verifique sua conexão com a internet
2. Confirme que a URL do script está correta
3. Tente limpar o cache do navegador

## Recursos Adicionais

### Enviar Email de Notificação

Adicione esta função ao seu script para receber um email quando alguém preencher o formulário:

```javascript
function enviarNotificacao(name, email, phone, message) {
  var destinatario = "seu-email@exemplo.com"; // Substitua pelo seu email
  var assunto = "Novo contato do site: " + name;
  var corpo = "Nome: " + name + "\n" +
              "Email: " + email + "\n" +
              "Telefone: " + phone + "\n" +
              "Mensagem: " + message;
  
  MailApp.sendEmail(destinatario, assunto, corpo);
}
```

E adicione esta linha dentro da função `doPost`, após `sheet.appendRow(...)`:

```javascript
enviarNotificacao(name, email, phone, message);
```

### Formatação Automática

Para melhorar a visualização, você pode adicionar formatação automática:

```javascript
// Após appendRow, adicione:
var lastRow = sheet.getLastRow();

// Formata a data
sheet.getRange(lastRow, 1).setNumberFormat("dd/mm/yyyy hh:mm:ss");

// Adiciona bordas
sheet.getRange(lastRow, 1, 1, 6).setBorder(true, true, true, true, false, false);

// Marca novos registros com cor
sheet.getRange(lastRow, 6).setBackground("#FFF3CD");
```

## Segurança

- O script usa `mode: 'no-cors'` que é necessário para o Google Apps Script
- Nunca exponha a URL do script publicamente em documentação
- Considere adicionar validação adicional no script para prevenir spam
- Para produção, considere implementar rate limiting

## Suporte

Se tiver problemas, verifique:
1. A documentação oficial do Google Apps Script
2. Os logs de execução no Apps Script
3. As mensagens de erro no console do navegador (F12)
