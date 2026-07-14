const form = document.querySelector<HTMLFormElement>('[data-contact-form]');

if (form) {
  const summaryBox = form.querySelector<HTMLElement>('[data-form-summary]');
  const errorBox = form.querySelector<HTMLElement>('[data-form-error]');
  const successBox = form.querySelector<HTMLElement>('[data-form-success]');
  const submitButton = form.querySelector<HTMLButtonElement>('[data-submit-button]');
  const requiredFields = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[required]'));
  const invalidMessages = new Set<string>();
  let submitting = false;
  let summaryScheduled = false;

  const clearSummary = () => {
    if (!summaryBox) return;
    summaryBox.hidden = true;
    summaryBox.innerHTML = '';
  };

  const showSummary = (messages: string[]) => {
    if (!summaryBox) return;
    summaryBox.hidden = false;
    summaryBox.innerHTML = `<p><strong>Verifique os seguintes campos:</strong></p><ul>${messages.map((message) => `<li>${message}</li>`).join('')}</ul>`;
    summaryBox.focus();
  };

  const showError = (message: string) => {
    if (!errorBox) {
      return;
    }
    errorBox.hidden = false;
    errorBox.textContent = message;
  };

  const hideError = () => {
    if (!errorBox) {
      return;
    }
    errorBox.hidden = true;
    errorBox.textContent = '';
  };

  const showSuccess = (message: string) => {
    if (!successBox) {
      return;
    }
    successBox.hidden = false;
    successBox.textContent = message;
  };

  const hideSuccess = () => {
    if (!successBox) {
      return;
    }
    successBox.hidden = true;
    successBox.textContent = '';
  };

  const setSubmittingState = (value: boolean) => {
    submitting = value;
    if (submitButton) {
      submitButton.disabled = value;
      submitButton.textContent = value ? 'A enviar...' : 'Enviar pedido';
      submitButton.setAttribute('aria-busy', value ? 'true' : 'false');
    }
  };

  const collectValidationMessages = () =>
    [...invalidMessages, ...requiredFields
      .filter((field) => !field.checkValidity())
      .map((field) => field.validationMessage)];

  requiredFields.forEach((field) => {
    field.addEventListener('input', () => {
      if (field.checkValidity()) {
        clearSummary();
      }
    });
  });

  form.addEventListener(
    'invalid',
    (event) => {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLSelectElement ||
        target instanceof HTMLTextAreaElement
      ) {
        invalidMessages.add(target.validationMessage);
      }

      if (!summaryScheduled) {
        summaryScheduled = true;
        window.requestAnimationFrame(() => {
          const messages = collectValidationMessages();
          if (messages.length > 0) {
            showSummary(messages);
          }
          summaryScheduled = false;
        });
      }
    },
    true
  );

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideError();
    hideSuccess();
    clearSummary();
    invalidMessages.clear();

    if (submitting) {
      showError('O pedido já está a ser enviado. Aguarde alguns segundos.');
      return;
    }

    if (!form.reportValidity()) {
      showSummary(collectValidationMessages());
      return;
    }

    const endpoint = form.dataset.endpoint || '';
    if (!endpoint.startsWith('https://')) {
      showError('Envio indisponível: configure o endpoint do formulário antes da publicação.');
      return;
    }

    setSubmittingState(true);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: new FormData(form)
      });

      if (!response.ok) {
        throw new Error('Não foi possível enviar o pedido. Verifique os dados e tente novamente.');
      }

      showSuccess('Pedido enviado com sucesso. A equipa LMDreams entrará em contacto consigo.');
      form.reset();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro inesperado no envio. Tente novamente ou use contacto direto.';
      showError(message);
    } finally {
      setSubmittingState(false);
    }
  });
}
