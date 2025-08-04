// Script para limpar autenticação
// Execute este script no console do navegador (F12)

console.log('🧹 Limpando cache de autenticação...');

// Limpar localStorage
localStorage.clear();

// Limpar sessionStorage
sessionStorage.clear();

// Limpar cookies relacionados à autenticação
document.cookie.split(";").forEach(function (c) {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});

console.log('✅ Cache limpo! Redirecionando para login...');

// Aguardar um pouco e recarregar
setTimeout(() => {
    window.location.href = '/';
}, 1000); 