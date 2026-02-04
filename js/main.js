const catalogModal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const catalogItems = document.querySelectorAll('.catalog-item');

if (catalogModal && modalClose) {
  modalClose.addEventListener('click', () => {
    catalogModal.classList.remove('active');
  });

  catalogModal.addEventListener('click', (e) => {
    if (e.target === catalogModal) {
      catalogModal.classList.remove('active');
    }
  });
}

catalogItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const img = item.querySelector('img');
    const title = item.querySelector('span');
    
    if (catalogModal && img && title) {
      const modalImage = document.getElementById('modalImage');
      const modalTitle = document.getElementById('modalTitle');
      
      if (modalImage) modalImage.src = img.src;
      if (modalImage) modalImage.alt = img.alt || title.textContent;
      if (modalTitle) modalTitle.textContent = title.textContent;
      
      catalogModal.classList.add('active');
    }
  });
});

const modalBtn = document.querySelector('.modal-btn');
if (modalBtn && catalogModal) {
  modalBtn.addEventListener('click', (e) => {
    catalogModal.classList.remove('active');
  });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href !== '') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        if (catalogModal && catalogModal.classList.contains('active')) {
          catalogModal.classList.remove('active');
        }
        
        setTimeout(() => {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    }
  });
});

let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (header) {
    if (currentScroll > 100) {
      header.style.boxShadow = '0 4px 30px rgba(0, 102, 204, 0.15)';
    } else {
      header.style.boxShadow = '0 2px 20px rgba(0, 102, 204, 0.08)';
    }
  }
  
  lastScroll = currentScroll;
});

const supportBtn = document.getElementById('supportBtn');
const supportModal = document.getElementById('supportModal');
const supportModalClose = document.getElementById('supportModalClose');
const supportForm = document.getElementById('supportForm');

if (supportBtn && supportModal) {
  supportBtn.addEventListener('click', () => {
    supportModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
}

if (supportModalClose && supportModal) {
  supportModalClose.addEventListener('click', () => {
    supportModal.classList.remove('active');
    document.body.style.overflow = '';
  });
}

if (supportModal) {
  supportModal.addEventListener('click', (e) => {
    if (e.target === supportModal) {
      supportModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && supportModal && supportModal.classList.contains('active')) {
    supportModal.classList.remove('active');
    document.body.style.overflow = '';
  }
});

if (supportForm) {
  supportForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('supportName').value.trim();
    const phone = document.getElementById('supportPhone').value.trim();
    const email = document.getElementById('supportEmail').value.trim();
    const message = document.getElementById('supportMessage').value.trim();
    const agree = document.getElementById('supportAgree').checked;
    
    
    if (!agree) {
      showFormMessage('Необходимо дать согласие на обработку персональных данных', 'error');
      return;
    }
    
    
    const submitBtn = supportForm.querySelector('.support-submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('message', message);
      formData.append('agree', agree);
      
      const response = await fetch('send-email.php', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        showFormMessage('Спасибо! Ваше сообщение успешно отправлено.', 'success');
        supportForm.reset();
        setTimeout(() => {
          supportModal.classList.remove('active');
          document.body.style.overflow = '';
        }, 2000);
      } else {
        throw new Error(result.message || 'Ошибка отправки');
      }
    } catch (error) {
      const subject = encodeURIComponent('Запрос с сайта ТЕХНИКА-М');
      const body = encodeURIComponent(
        `Имя: ${name}\n` +
        `Телефон: ${phone}\n` +
        `E-mail: ${email || 'Не указан'}\n\n` +
        `Сообщение:\n${message}\n\n` +
        `Согласие на обработку персональных данных: Да`
      );
      
      const mailtoLink = `mailto:info@technics-m.ru?subject=${subject}&body=${body}`;
      window.location.href = mailtoLink;
      
      showFormMessage('Спасибо! Ваше сообщение будет отправлено. Проверьте почтовую программу.', 'success');
      
      setTimeout(() => {
        supportForm.reset();
        supportModal.classList.remove('active');
        document.body.style.overflow = '';
      }, 2000);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

function showFormMessage(text, type) {
  const existingMessage = supportForm.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `form-message ${type}`;
  messageDiv.textContent = text;
  supportForm.appendChild(messageDiv);
  
  if (type === 'success') {
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }
}
