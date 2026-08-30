export function renderRecoveryNotice(root, available, onRecover, onDiscard) {
  if (!root) return;
  root.innerHTML = "";
  if (!available) return;

  const box = document.createElement("div");
  box.className = "recovery";
  box.innerHTML = `
    <strong>Recoverable session found</strong>
    <p>A previous recording was interrupted. Your locally stored checkpoint has not been uploaded.</p>
  `;

  const recover = document.createElement("button");
  recover.textContent = "Recover Session";
  recover.onclick = onRecover;

  const discard = document.createElement("button");
  discard.textContent = "Discard Recovery";
  discard.onclick = onDiscard;

  box.append(recover, discard);
  root.append(box);
}
