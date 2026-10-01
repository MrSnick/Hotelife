/*
  HOTELIFE — aviso "¡Solicitud enviada!" (frame "confirmacion-toast" en Figma).
  Lo usan todos los botones "Enviar solicitud". El botón LISTO lleva al Inicio.
  Uso: HotelifeConfirm.show();
*/
(function () {
  const css = `
    .confirm-overlay{ position:absolute; inset:0; background:rgba(26,34,45,0.45); display:none; align-items:flex-end; z-index:50; }
    .confirm-overlay.open{ display:flex; }
    .confirm-toast{
      width:100%; background:#fff; border-radius:24px 24px 0 0;
      padding:24px 24px 28px; display:flex; align-items:center; justify-content:space-between; gap:16px;
      animation:confirm-up .25s ease-out;
    }
    .confirm-check{
      width:40px; height:40px; border-radius:20px; background:#1a222d; border:1.5px solid #d4b285;
      display:flex; align-items:center; justify-content:center; color:#d4b285; font-size:18px; margin-bottom:8px;
    }
    .confirm-title{ font-family:"Cormorant Garamond", serif; font-weight:700; font-size:20px; color:#1a222d; }
    .confirm-ok{
      flex-shrink:0; height:44px; padding:0 24px; border-radius:16px; border:none;
      background:#1a222d; color:#fff; font-family:inherit; font-weight:700; font-size:12px; letter-spacing:.5px; cursor:pointer;
    }
    @keyframes confirm-up{ from{ transform:translateY(100%); } to{ transform:none; } }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.className = 'confirm-overlay';
  overlay.innerHTML = `
    <div class="confirm-toast" role="alertdialog" aria-label="Solicitud enviada">
      <div>
        <div class="confirm-check">✓</div>
        <p class="confirm-title">¡Solicitud enviada!</p>
      </div>
      <button class="confirm-ok" type="button">LISTO</button>
    </div>
  `;
  (document.querySelector('.phone') || document.body).appendChild(overlay);
  overlay.querySelector('.confirm-ok').addEventListener('click', () => {
    window.location.href = 'home.html';
  });

  window.HotelifeConfirm = {
    show() { overlay.classList.add('open'); overlay.querySelector('.confirm-ok').focus(); }
  };
})();
