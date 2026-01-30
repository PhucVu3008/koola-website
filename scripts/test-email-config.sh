#!/bin/bash
# Test Email Configuration Script
# Usage: ./test-email-config.sh [recipient@email.com]

set -e

RECIPIENT="${1:-admin@example.com}"

echo "================================================"
echo "Testing Email Configuration"
echo "================================================"
echo ""
echo "Recipient: $RECIPIENT"
echo ""

# Check if we're inside Docker container
if [ -f /.dockerenv ]; then
  echo "✅ Running inside Docker container"
  EXEC_CMD=""
else
  echo "⚠️  Running on host, will use docker-compose exec"
  EXEC_CMD="docker-compose exec -T api"
fi

# Check environment variables
echo ""
echo "Checking SMTP Configuration..."
echo "-----------------------------------"

$EXEC_CMD sh -c 'echo "SMTP_HOST=$SMTP_HOST"'
$EXEC_CMD sh -c 'echo "SMTP_PORT=$SMTP_PORT"'
$EXEC_CMD sh -c 'echo "SMTP_SECURE=$SMTP_SECURE"'
$EXEC_CMD sh -c 'echo "SMTP_USER=$SMTP_USER"'
$EXEC_CMD sh -c 'echo "SMTP_FROM=$SMTP_FROM"'
$EXEC_CMD sh -c 'echo "NOTIFICATION_EMAIL=$NOTIFICATION_EMAIL"'

echo ""
echo "Testing SMTP Connection..."
echo "-----------------------------------"

# Test SMTP connection
$EXEC_CMD node -e "
const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transport.verify()
  .then(() => {
    console.log('✅ SMTP connection successful');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ SMTP connection failed:', err.message);
    process.exit(1);
  });
"

echo ""
echo "Sending Test Email..."
echo "-----------------------------------"

# Send test email
$EXEC_CMD node -e "
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const from = process.env.SMTP_FROM || process.env.SMTP_USER;

transport.sendMail({
  from: from,
  to: '${RECIPIENT}',
  subject: '✅ Test Email from Koola Website',
  text: 'This is a test email. If you received this, your SMTP configuration is working correctly.',
  html: '<p><strong>✅ Success!</strong></p><p>This is a test email. If you received this, your SMTP configuration is working correctly.</p>',
})
  .then((info) => {
    console.log('✅ Test email sent successfully');
    console.log('Message ID:', info.messageId);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Failed to send test email:', err.message);
    process.exit(1);
  });
"

echo ""
echo "================================================"
echo "✅ Email configuration test completed!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Check your inbox: $RECIPIENT"
echo "2. Check spam folder if not in inbox"
echo "3. Test contact form: http://localhost:3000/en/contact"
echo ""
