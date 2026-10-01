import RoyalAlert from '../src/index.js';

/* ── Page dark-mode sync ───────────────────────────────────── */
document.getElementById('themeToggle').addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark');
    RoyalAlert.config({ theme: isDark ? 'dark' : 'light' });
});

/* ── Dispatch all demo buttons ─────────────────────────────── */
document.querySelectorAll('[data-demo]').forEach(btn => {
    btn.addEventListener('click', () => runDemo(btn.dataset.demo));
});

async function runDemo(id) {
    const isDark = document.body.classList.contains('dark');
    const theme  = isDark ? 'dark' : 'light';

    switch (id) {

    /* ── Hero ─────────────────────────────────────────────── */
    case 'welcome':
        RoyalAlert.fire({ icon:'success', title:'Welcome to RoyalAlert!', message:'Lightweight. Modern. Zero Dependency.', confirmText:"Let's go! 🚀", theme });
        break;

    /* ── Basic alerts ─────────────────────────────────────── */
    case 'success':  RoyalAlert.success('Your changes have been saved successfully!'); break;
    case 'error':    RoyalAlert.error('Connection failed. Please try again.'); break;
    case 'warning':  RoyalAlert.warning('Your session will expire in 5 minutes.'); break;
    case 'info':     RoyalAlert.info('RoyalAlert v1.0 is now available! 🎉'); break;
    case 'question': RoyalAlert.fire({ icon:'question', title:'Any questions?', message:'Feel free to explore all the demos.', confirmText:'Got it', theme }); break;
    case 'loading':
        RoyalAlert.loading('Please wait…');
        setTimeout(() => { RoyalAlert.close(); RoyalAlert.success('Done!'); }, 2000);
        break;
    case 'custom-fire':
        RoyalAlert.fire({ icon:'success', title:'Profile Updated', message:'Your photo and bio have been saved.', confirmText:'Awesome!', theme });
        break;
    case 'close-btn':
        RoyalAlert.fire({ icon:'info', title:'Notice', message:'Dismiss using the × button or Esc key.', closeButton:true, showConfirmButton:false, theme });
        break;
    case 'no-icon':
        RoyalAlert.fire({ title:'No icon dialog', message:'Sometimes you just need clean text.', theme });
        break;
    case 'auto-close':
        RoyalAlert.fire({ icon:'info', title:'Auto-closing in 3 seconds', message:'Watch the timer bar at the bottom.', timerProgressBar:true, duration:3000, autoClose:true, showConfirmButton:false, theme });
        break;

    /* ── Confirmations ────────────────────────────────────── */
    case 'confirm-delete': {
        const r = await RoyalAlert.confirm({ icon:'warning', title:'Delete this item?', message:'This action is permanent and cannot be undone.', confirmText:'🗑 Yes, delete', cancelText:'Keep it', theme });
        if (r.confirmed) RoyalAlert.toast({ type:'success', message:'Item deleted!', position:'bottom-left' });
        break;
    }
    case 'confirm-3btn': {
        const r = await RoyalAlert.fire({ icon:'question', title:'Save your changes?', showDenyButton:true, showCancelButton:true, confirmText:'💾 Save', denyText:"Don't save", cancelText:'Go back', theme });
        if (r.confirmed)   RoyalAlert.toast({ type:'success', message:'Changes saved!', position:'bottom-left' });
        else if (r.denied) RoyalAlert.toast({ type:'info',    message:'Changes discarded.', position:'bottom-left' });
        break;
    }
    case 'confirm-reverse':
        RoyalAlert.confirm({ title:'Reversed buttons', message:'Cancel is on the right here.', reverseButtons:true, theme });
        break;
    case 'confirm-custom-backdrop':
        RoyalAlert.fire({ icon:'question', title:'Custom backdrop', message:'The overlay can be any CSS colour.', backdrop:'rgba(79,70,229,.5)', theme });
        break;

    /* ── Toasts ───────────────────────────────────────────── */
    case 'toast-tl':      RoyalAlert.toast({ type:'success', message:'Top Left',      position:'top-left',      duration:3000 }); break;
    case 'toast-tc':      RoyalAlert.toast({ type:'info',    message:'Top Center',    position:'top-center',    duration:3000 }); break;
    case 'toast-tr':      RoyalAlert.toast({ type:'warning', message:'Top Right',     position:'top-right',     duration:3000 }); break;
    case 'toast-bl':      RoyalAlert.toast({ type:'success', message:'Bottom Left',   position:'bottom-left',   duration:3000 }); break;
    case 'toast-bc':      RoyalAlert.toast({ type:'info',    message:'Bottom Center', position:'bottom-center', duration:3000 }); break;
    case 'toast-br':      RoyalAlert.toast({ type:'warning', message:'Bottom Right',  position:'bottom-right',  duration:3000 }); break;
    case 'toast-success': RoyalAlert.toast({ type:'success', title:'Saved!',     message:'Record saved to database.', duration:3500 }); break;
    case 'toast-error':   RoyalAlert.toast({ type:'error',   title:'Upload failed', message:'File size exceeds 5 MB.', duration:4000 }); break;
    case 'toast-warning': RoyalAlert.toast({ type:'warning', message:'Low disk space detected.', duration:3000 }); break;
    case 'toast-info':    RoyalAlert.toast({ type:'info',    message:'Hover me to pause the timer!', duration:5000 }); break;
    case 'toast-stack':
        ['info','success','warning','error'].forEach((t,i) => {
            setTimeout(() => RoyalAlert.toast({ type:t, message:`Toast #${i+1} — ${t}`, duration:5000 }), i * 200);
        });
        break;

    /* ── Prompts ──────────────────────────────────────────── */
    case 'prompt-text': {
        const r = await RoyalAlert.prompt({ title:'What is your name?', inputPlaceholder:'e.g. Mehdi', theme });
        if (r.confirmed && r.value) RoyalAlert.toast({ type:'success', message:`Hello, ${r.value}! 👋` });
        break;
    }
    case 'prompt-email': {
        const r = await RoyalAlert.prompt({ title:'Enter your email', inputType:'email', inputPlaceholder:'you@example.com', theme });
        if (r.confirmed) RoyalAlert.success(`Email: ${r.value}`);
        break;
    }
    case 'prompt-pass': {
        const r = await RoyalAlert.prompt({ title:'Enter your password', inputType:'password', inputPlaceholder:'••••••••', theme });
        if (r.confirmed) RoyalAlert.toast({ type:'info', message:'Password accepted.' });
        break;
    }
    case 'prompt-textarea': {
        const r = await RoyalAlert.prompt({ title:'Leave a comment', inputType:'textarea', inputPlaceholder:'Type here…', theme });
        if (r.confirmed) RoyalAlert.success('Comment submitted!');
        break;
    }
    case 'prompt-number': {
        const r = await RoyalAlert.prompt({ title:'Enter a number', inputType:'number', inputPlaceholder:'0–100', theme });
        if (r.confirmed) RoyalAlert.success(`You entered: ${r.value}`);
        break;
    }
    case 'prompt-ip': {
        const ipRe = /^(\d{1,3}\.){3}\d{1,3}$/;
        const r = await RoyalAlert.prompt({
            title:'Enter an IP address', inputPlaceholder:'192.168.1.1',
            inputValidator: v => { if (!v) return 'IP is required.'; if (!ipRe.test(v)) return 'Not a valid IP (e.g. 192.168.1.1).' },
            theme
        });
        if (r.confirmed) RoyalAlert.success(`IP: ${r.value}`);
        break;
    }
    case 'prompt-required': {
        const r = await RoyalAlert.prompt({
            title:'Username (required)',
            inputValidator: v => { if (!v || v.trim().length < 3) return 'At least 3 characters required.' },
            theme
        });
        if (r.confirmed) RoyalAlert.success(`Welcome, ${r.value}!`);
        break;
    }
    case 'prompt-email-val': {
        const r = await RoyalAlert.prompt({
            title:'Enter email to register',
            inputType:'email', inputPlaceholder:'you@example.com',
            inputValidator: async v => {
                if (!v) return 'Email is required.';
                if (!v.includes('@')) return 'Enter a valid email.';
                await new Promise(res => setTimeout(res, 800)); // simulate async check
                if (v.toLowerCase().startsWith('admin')) return 'That username is reserved.';
            },
            theme
        });
        if (r.confirmed) RoyalAlert.success(`Registered: ${r.value}`);
        break;
    }

    /* ── Loading & Progress ───────────────────────────────── */
    case 'loading-steps':
        RoyalAlert.loading('Connecting to server…');
        setTimeout(() => RoyalAlert.update({ message:'Authenticating…' }), 900);
        setTimeout(() => RoyalAlert.update({ message:'Fetching data…' }),   1800);
        setTimeout(() => { RoyalAlert.close(); RoyalAlert.success('Data loaded!'); }, 2700);
        break;
    case 'progress': {
        RoyalAlert.progress({ title:'Processing files', message:'Starting…', progress:0 });
        let p = 0;
        const iv = setInterval(() => {
            p = Math.min(100, p + Math.floor(Math.random() * 14) + 4);
            RoyalAlert.update({ progress:p, message: p < 100 ? `${p}% complete…` : '✓ All done!' });
            if (p >= 100) { clearInterval(iv); setTimeout(() => { RoyalAlert.close(); RoyalAlert.success('All files processed!'); }, 700); }
        }, 280);
        break;
    }
    case 'timer-bar':
        RoyalAlert.fire({ icon:'info', title:'Auto-close in 4s', message:'Watch the timer bar below.', timerProgressBar:true, duration:4000, autoClose:true, showConfirmButton:false, theme });
        break;
    case 'async-ok':
        await RoyalAlert.async({ title:'Fetching data…', action: () => fetch('https://jsonplaceholder.typicode.com/todos/1').then(r => r.json()), successMessage:'Data loaded successfully!' });
        break;
    case 'async-fail':
        await RoyalAlert.async({ title:'Connecting…', action: () => fetch('https://httpstat.us/500').then(r => { if (!r.ok) throw new Error('Server error'); }), errorMessage:'Server returned an error.' }).catch(()=>{});
        break;
    case 'request':
        RoyalAlert.request({ url:'https://jsonplaceholder.typicode.com/posts/1', method:'GET', loadingMessage:'Loading post from API…', successMessage:'Post fetched successfully!' });
        break;

    /* ── HTML Modals ──────────────────────────────────────── */
    case 'modal-html':
        RoyalAlert.modal({ title:'HTML Content', html:`<div style="text-align:left"><p>Embed any <strong>HTML</strong> inside a dialog.</p><ul style="margin:.75rem 0 0 1.2rem"><li>Lists &amp; formatting</li><li>Embedded forms</li><li>Tables &amp; media</li></ul></div>`, confirmText:'Got it', theme });
        break;
    case 'modal-image':
        RoyalAlert.fire({ title:'Beautiful scenery', imageUrl:'https://picsum.photos/seed/royal/480/220', imageWidth:480, imageHeight:220, message:'Images can be embedded directly in a dialog.', confirmText:'Lovely!', theme });
        break;
    case 'modal-footer':
        RoyalAlert.fire({ icon:'error', title:'Payment declined', message:'Your card was declined. Please check your details.', footer:'<a href="#">Why is my card being declined?</a>', theme });
        break;
    case 'modal-scroll':
        RoyalAlert.modal({ title:'Terms of Service', html:`<div style="text-align:left;max-height:220px;overflow-y:auto;padding-right:.5rem">${Array(10).fill('<p style="margin-bottom:.75rem">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.</p>').join('')}</div>`, confirmText:'I Agree', theme });
        break;
    case 'custom-btns':
        RoyalAlert.fire({ title:'Choose an action', buttons:[
            { id:'save',    text:'💾 Save',       type:'primary',   callback: () => RoyalAlert.toast({ type:'success', message:'Saved!'        }) },
            { id:'draft',   text:'📝 Save draft', type:'secondary', callback: () => RoyalAlert.toast({ type:'info',    message:'Saved as draft' }) },
            { id:'discard', text:'🗑 Discard',    type:'danger',    callback: () => RoyalAlert.toast({ type:'warning', message:'Discarded'      }) }
        ], theme });
        break;
    case 'reverse-btns':
        RoyalAlert.confirm({ title:'Reversed buttons', message:'Confirm is on the left, Cancel on the right.', reverseButtons:true, theme });
        break;

    /* ── Animations ───────────────────────────────────────── */
    case 'anim-scale': RoyalAlert.fire({ icon:'success', title:'Scale',   message:'Default spring-bounce entrance.', animation:'scale', theme }); break;
    case 'anim-fade':  RoyalAlert.fire({ icon:'info',    title:'Fade',    message:'Smooth opacity transition.',       animation:'fade',  theme }); break;
    case 'anim-slide': RoyalAlert.fire({ icon:'warning', title:'Slide',   message:'Slides down from above.',          animation:'slide', theme }); break;
    case 'anim-flip':  RoyalAlert.fire({ icon:'question',title:'Flip',    message:'3D perspective entrance.',         animation:'flip',  theme }); break;

    /* ── Themes ───────────────────────────────────────────── */
    case 'theme-light': RoyalAlert.fire({ icon:'success', title:'Light theme', message:'Clean and bright.', theme:'light' }); break;
    case 'theme-dark':  RoyalAlert.fire({ icon:'success', title:'Dark theme',  message:'Easy on the eyes.',  theme:'dark' }); break;
    case 'theme-auto':  RoyalAlert.fire({ icon:'info',    title:'Auto theme',  message:'Follows your OS preference.', theme:'auto' }); break;
    }
}
