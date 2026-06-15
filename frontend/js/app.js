
// ===== STATE =====
const state = {
  currentUser: null,
  isAdmin: false,
  cart: [],
  editProductId: null,
  users: [
    {id:'u1',name:'Ana GarcÃ­a',email:'ana@test.com',pwd:'123456',orders:[],addresses:[{id:'a1',alias:'Casa',street:'Av. Las Condes 456',city:'Santiago',region:'RM',zip:'7500000',ref:'Timbre 3B',default:true}],payments:[]}
  ],
  admin: {name:'Administrador',email:'admin@faldascustom.cl',pwd:'admin123',firstLogin:true},
  orders: [
    {id:'PED-001',userId:'u1',items:[{name:'Falda Bohemia',qty:1,price:45990,size:'M',color:'Beige'}],total:45990,status:'delivered',date:'2025-03-10'},
    {id:'PED-002',userId:'u1',items:[{name:'Falda ClÃ¡sica',qty:2,price:35990,size:'S',color:'Negro'}],total:71980,status:'shipping',date:'2025-04-22'},
  ],
  products: [
    {id:'p1',name:'Falda Bohemia Midi',type:'Midi',material:'Lino',price:45990,stock:12,emoji:'ðŸŒ¸',desc:'Falda midi bohemia confeccionada en lino premium con detalles florales bordados. Perfecta para ocasiones especiales y salidas de verano.',sizes:['XS','S','M','L','XL'],colors:['Beige','Blanco','Floral'],featured:true,active:true},
    {id:'p2',name:'Falda ClÃ¡sica LÃ¡piz',type:'LÃ¡piz',material:'SatÃ©n',price:35990,stock:8,emoji:'âœ¨',desc:'Falda lÃ¡piz en satÃ©n de alta calidad. Silueta elegante que favorece toda figura. Ideal para el trabajo o eventos formales.',sizes:['XS','S','M','L'],colors:['Negro','Azul','Rojo'],featured:false,active:true},
    {id:'p3',name:'Falda Plisada Mini',type:'Plisada',material:'Tul',price:29990,stock:15,emoji:'ðŸ’«',desc:'Falda mini plisada en tul con volumen perfecto. Un toque juvenil y romÃ¡ntico para cualquier ocasiÃ³n casual o festiva.',sizes:['XS','S','M','L','XL','XXL'],colors:['Blanco','Rosa','Azul'],featured:true,active:true},
  ]
};

// ===== NAVIGATION =====
function goPage(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  window.scrollTo(0,0);
  if(page==='home') renderHomeProducts();
  if(page==='faldas'){renderFaldas();applyFilters();}
  if(page==='dashboard') renderDashboard();
  if(page==='admin') renderAdmin();
}

// ===== PRODUCTS =====
function renderHomeProducts(){
  const el = document.getElementById('homeProducts');
  const active = state.products.filter(p=>p.active).slice(0,3);
  el.innerHTML = active.map(p=>productCardHTML(p)).join('');
}
function renderFaldas(){
  const el = document.getElementById('faldaProducts');
  el.innerHTML = state.products.filter(p=>p.active).map(p=>productCardHTML(p)).join('');
}
function productCardHTML(p){
  return `<div class="product-card">
    <div class="product-img" style="background:${getProductBg(p.emoji)}">
      ${p.featured?'<span class="product-badge">Nuevo</span>':''}
      <span style="font-size:4rem">${p.emoji}</span>
    </div>
    <div class="product-info">
      <div class="product-type">${p.type} Â· ${p.material}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-price">$${p.price.toLocaleString('es-CL')}</div>
      <div class="pill-list">${p.colors.map(c=>`<span class="pill" style="background:${colorHex(c)};border-color:${colorHex(c)}80;color:${colorText(c)}">${c}</span>`).join('')}</div>
      <div class="product-actions">
        <button class="btn-sm" onclick="showDetail('${p.id}')">Ver Detalle</button>
        <button class="btn-sm primary" onclick="quickAdd('${p.id}')">+ Carrito</button>
      </div>
    </div>
  </div>`;
}
function getProductBg(e){const m={'ðŸŒ¸':'#FDF2F8','âœ¨':'#F0F4FF','ðŸ’«':'#F5F0FF'};return m[e]||'#F5F0E8';}
function colorHex(c){const m={Negro:'#1A1A1A',Blanco:'#F5F5F0',Beige:'#D4B896',Rojo:'#C0392B',Azul:'#2980B9',Floral:'#E8A0B4',Rosa:'#F4A0B4'};return m[c]||'#E8E0D4';}
function colorText(c){return c==='Negro'||c==='Azul'?'#fff':'#333';}

function showDetail(id){
  const p = state.products.find(x=>x.id===id);
  if(!p) return;
  const el = document.getElementById('productDetailContent');
  el.innerHTML = `
    <div class="detail-img">${p.emoji}</div>
    <div>
      <div class="detail-type">${p.type} Â· ${p.material}</div>
      <h1 class="detail-name">${p.name}</h1>
      <div class="detail-price">$${p.price.toLocaleString('es-CL')}</div>
      <p class="detail-desc">${p.desc}</p>
      <div class="option-title">Talla</div>
      <div class="size-options">${p.sizes.map((s,i)=>`<button class="size-btn${i===0?' active':''}" onclick="this.parentNode.querySelectorAll('.size-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active')">${s}</button>`).join('')}</div>
      <div class="option-title">Color</div>
      <div class="color-options">${p.colors.map((c,i)=>`<div class="color-opt${i===0?' active':''}" style="background:${colorHex(c)}" title="${c}" onclick="this.parentNode.querySelectorAll('.color-opt').forEach(b=>b.classList.remove('active'));this.classList.add('active')"></div>`).join('')}</div>
      <div style="display:flex;gap:1rem;margin-top:1.5rem">
        <button class="btn-primary" style="flex:1" onclick="addToCartFromDetail('${p.id}')">Agregar al Carrito</button>
      </div>
      <p style="color:var(--ink3);font-size:.85rem;margin-top:.8rem">Stock disponible: ${p.stock} unidades</p>
    </div>`;
  goPage('detail');
}

function addToCartFromDetail(id){
  const p = state.products.find(x=>x.id===id);
  const el = document.getElementById('productDetailContent');
  const sizeBtn = el.querySelector('.size-btn.active');
  const colorOpt = el.querySelector('.color-opt.active');
  const size = sizeBtn ? sizeBtn.textContent : p.sizes[0];
  const color = colorOpt ? colorOpt.getAttribute('title') : p.colors[0];
  addToCart(id, size, color);
}

function quickAdd(id){
  const p = state.products.find(x=>x.id===id);
  addToCart(id, p.sizes[0], p.colors[0]);
}

function addToCart(id, size, color){
  if(!state.currentUser && !state.isAdmin){
    notify('Inicia sesiÃ³n para agregar al carrito','error');
    openModal('loginModal');return;
  }
  const p = state.products.find(x=>x.id===id);
  const key = id+size+color;
  const ex = state.cart.find(x=>x.key===key);
  if(ex) ex.qty++;
  else state.cart.push({key,id,name:p.name,emoji:p.emoji,price:p.price,size,color,qty:1});
  updateCartUI();
  notify('Producto agregado al carrito âœ“');
}

function updateCartUI(){
  const total = state.cart.reduce((s,x)=>s+x.qty,0);
  document.getElementById('cartCount').textContent=total;
  renderCartItems();
}

function renderCartItems(){
  const el = document.getElementById('cartItems');
  if(!state.cart.length){
    el.innerHTML='<div class="cart-empty"><span>ðŸ›ï¸</span><p>Tu carrito estÃ¡ vacÃ­o</p></div>';
    document.getElementById('cartTotal').textContent='$0';return;
  }
  el.innerHTML=state.cart.map(item=>`
    <div class="cart-item">
      <div class="cart-item-img">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-detail">${item.size} Â· ${item.color}</div>
        <div class="cart-item-price">$${(item.price*item.qty).toLocaleString('es-CL')}</div>
        <div class="cart-qty">
          <button class="qty-btn" onclick="changeQty('${item.key}',-1)">âˆ’</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.key}',1)">+</button>
        </div>
      </div>
      <button class="btn-icon" onclick="removeFromCart('${item.key}')" title="Eliminar">âœ•</button>
    </div>`).join('');
  const total=state.cart.reduce((s,x)=>s+x.price*x.qty,0);
  document.getElementById('cartTotal').textContent='$'+total.toLocaleString('es-CL');
}

function changeQty(key,d){
  const item=state.cart.find(x=>x.key===key);
  if(!item) return;
  item.qty+=d;
  if(item.qty<=0) state.cart=state.cart.filter(x=>x.key!==key);
  updateCartUI();
}
function removeFromCart(key){state.cart=state.cart.filter(x=>x.key!==key);updateCartUI();}
function toggleCart(){
  document.getElementById('cartDrawer').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
  renderCartItems();
}

// ===== FILTERS =====
function applyFilters(){
  const checks = (name)=>[...document.querySelectorAll(`input[type=checkbox][value]`)].filter(c=>c.closest('.filter-section').querySelector('.filter-title').textContent===name&&c.checked).map(c=>c.value);
  const sizes=checks('Talla'),colors=checks('Color'),types=checks('Tipo'),mats=checks('Material');
  let res=state.products.filter(p=>p.active);
  if(sizes.length) res=res.filter(p=>sizes.some(s=>p.sizes.includes(s)));
  if(colors.length) res=res.filter(p=>colors.some(c=>p.colors.includes(c)));
  if(types.length) res=res.filter(p=>types.includes(p.type));
  if(mats.length) res=res.filter(p=>mats.includes(p.material));
  document.getElementById('faldaProducts').innerHTML=res.map(p=>productCardHTML(p)).join('');
  document.getElementById('resultsCount').textContent=`${res.length} resultado${res.length!==1?'s':''}`;
}
function clearFilters(){
  document.querySelectorAll('.filter-option input').forEach(c=>c.checked=false);
  applyFilters();
}

// ===== AUTH =====
function doLogin(){
  const email=document.getElementById('loginEmail').value.trim();
  const pwd=document.getElementById('loginPwd').value;
  if(email===state.admin.email){
    if(pwd===state.admin.pwd){
      closeModal('loginModal');
      state.isAdmin=true;
      state.currentUser=null;
      updateNav();
      if(state.admin.firstLogin){openModal('firstLoginModal');return;}
      goPage('admin');
      notify('Bienvenido, Administrador');
    } else showAlert('loginError','ContraseÃ±a incorrecta','error');
    return;
  }
  const user=state.users.find(u=>u.email===email&&u.pwd===pwd);
  if(user){
    state.currentUser=user;state.isAdmin=false;
    closeModal('loginModal');updateNav();
    goPage('dashboard');
    notify('Bienvenido, '+user.name.split(' ')[0]);
  } else showAlert('loginError','Correo o contraseÃ±a incorrectos','error');
}

function doRegister(){
  const name=document.getElementById('regName').value.trim();
  const email=document.getElementById('regEmail').value.trim();
  const pwd=document.getElementById('regPwd').value;
  const pwd2=document.getElementById('regPwd2').value;
  if(!name||!email||!pwd){showAlert('registerError','Completa todos los campos','error');return;}
  if(pwd!==pwd2){showAlert('registerError','Las contraseÃ±as no coinciden','error');return;}
  if(pwd.length<6){showAlert('registerError','La contraseÃ±a debe tener al menos 6 caracteres','error');return;}
  if(state.users.find(u=>u.email===email)){showAlert('registerError','Este correo ya estÃ¡ registrado','error');return;}
  const newUser={id:'u'+Date.now(),name,email,pwd,orders:[],addresses:[],payments:[]};
  state.users.push(newUser);
  state.currentUser=newUser;state.isAdmin=false;
  closeModal('registerModal');updateNav();
  goPage('dashboard');
  notify('Cuenta creada exitosamente. Â¡Bienvenida!');
}

function changeFirstPassword(){
  const p1=document.getElementById('newAdminPwd1').value;
  const p2=document.getElementById('newAdminPwd2').value;
  if(p1.length<6){showAlert('firstLoginError','MÃ­nimo 6 caracteres','error');return;}
  if(p1!==p2){showAlert('firstLoginError','Las contraseÃ±as no coinciden','error');return;}
  state.admin.pwd=p1;state.admin.firstLogin=false;
  closeModal('firstLoginModal');
  goPage('admin');
  notify('ContraseÃ±a actualizada correctamente');
}

function logout(){
  state.currentUser=null;state.isAdmin=false;state.cart=[];
  updateNav();goPage('home');
  notify('SesiÃ³n cerrada');
}

function updateNav(){
  const el=document.getElementById('navActions');
  if(state.isAdmin){
    el.innerHTML=`<button class="btn-nav" onclick="goPage('admin')">Admin Panel</button><button class="btn-nav" onclick="logout()">Salir</button>`;
  } else if(state.currentUser){
    el.innerHTML=`<button class="btn-nav" onclick="goPage('dashboard')">Mi Cuenta</button>
    <div class="cart-badge" id="cartBadge" onclick="toggleCart()">ðŸ›ï¸ <span class="cart-count" id="cartCount">${state.cart.length}</span></div>
    <button class="btn-nav" onclick="logout()">Salir</button>`;
  } else {
    el.innerHTML=`<button class="btn-nav" onclick="openModal('loginModal')">Ingresar</button><button class="btn-nav" onclick="openModal('registerModal')">Registrarse</button>`;
  }
}

// ===== DASHBOARD =====
function renderDashboard(){
  if(!state.currentUser) return;
  const u=state.currentUser;
  document.getElementById('dashWelcome').textContent='Hola, '+u.name.split(' ')[0];
  const myOrders=state.orders.filter(o=>o.userId===u.id);
  document.getElementById('dOrders').textContent=myOrders.length;
  document.getElementById('dAddresses').textContent=u.addresses.length;
  document.getElementById('dPayments').textContent=u.payments.length;
  document.getElementById('accName').value=u.name;
  document.getElementById('accEmail').value=u.email;
  renderOrders(myOrders);renderAddresses();renderPayments();
}

function renderOrders(orders){
  const el=document.getElementById('ordersList');
  if(!orders.length){el.innerHTML='<p style="color:var(--ink3);padding:1rem 0">No tienes pedidos aÃºn.</p>';return;}
  el.innerHTML=orders.map(o=>`
    <div class="order-row">
      <span style="font-weight:500">${o.id}</span>
      <span style="color:var(--ink2)">${o.date}</span>
      <span>$${o.total.toLocaleString('es-CL')}</span>
      <span><span class="status-badge status-${o.status}">${{pending:'Pendiente',shipping:'En camino',delivered:'Entregado'}[o.status]||o.status}</span></span>
    </div>`).join('');
}

function renderAddresses(){
  const el=document.getElementById('addressesList');
  const u=state.currentUser;
  if(!u.addresses.length){el.innerHTML='<p style="color:var(--ink3)">No tienes direcciones guardadas.</p>';return;}
  el.innerHTML=u.addresses.map(a=>`
    <div class="address-card${a.default?' address-default':''}">
      <div>
        <p style="font-weight:500;margin-bottom:.2rem">${a.alias}${a.default?' <span style="font-size:.75rem;color:var(--gold)">(Principal)</span>':''}</p>
        <p style="font-size:.9rem;color:var(--ink2)">${a.street}</p>
        <p style="font-size:.9rem;color:var(--ink2)">${a.city}, ${a.region} â€” ${a.zip}</p>
        ${a.ref?`<p style="font-size:.8rem;color:var(--ink3);margin-top:.3rem">${a.ref}</p>`:''}
      </div>
      <div style="display:flex;gap:.3rem">
        ${!a.default?`<button class="btn-icon edit" onclick="setDefaultAddress('${a.id}')" title="Establecer como principal">â˜…</button>`:''}
        <button class="btn-icon" onclick="deleteAddress('${a.id}')" title="Eliminar">âœ•</button>
      </div>
    </div>`).join('');
}

function renderPayments(){
  const el=document.getElementById('paymentsList');
  const u=state.currentUser;
  if(!u.payments.length){el.innerHTML='<p style="color:var(--ink3)">No tienes mÃ©todos de pago guardados.</p>';return;}
  el.innerHTML=u.payments.map(p=>`
    <div class="payment-card">
      <div class="card-icon">${p.type==='card'?'ðŸ’³':'ðŸ¦'}</div>
      <div style="flex:1">
        <p style="font-weight:500;font-size:.9rem">${p.type==='card'?`Tarjeta ****${p.last4}`:`${p.bank} â€” ${p.account}`}</p>
        <p style="font-size:.8rem;color:var(--ink3)">${p.type==='card'?p.holder:`RUT: ${p.rut}`}</p>
      </div>
      <button class="btn-icon" onclick="deletePayment('${p.id}')" title="Eliminar">âœ•</button>
    </div>`).join('');
}

function switchDashTab(name, btn){
  document.querySelectorAll('[id^=dashTab-]').forEach(t=>t.classList.add('hidden'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('dashTab-'+name).classList.remove('hidden');
  btn.classList.add('active');
}

function saveAddress(){
  const u=state.currentUser;
  const a={id:'a'+Date.now(),alias:v('addrAlias'),street:v('addrStreet'),city:v('addrCity'),region:v('addrRegion'),zip:v('addrZip'),ref:v('addrRef'),default:u.addresses.length===0};
  u.addresses.push(a);closeModal('addAddressModal');renderAddresses();
  document.getElementById('dAddresses').textContent=u.addresses.length;
  notify('DirecciÃ³n guardada');
}

function deleteAddress(id){
  const u=state.currentUser;
  u.addresses=u.addresses.filter(a=>a.id!==id);
  if(u.addresses.length&&!u.addresses.some(a=>a.default)) u.addresses[0].default=true;
  renderAddresses();document.getElementById('dAddresses').textContent=u.addresses.length;
  notify('DirecciÃ³n eliminada');
}

function setDefaultAddress(id){
  const u=state.currentUser;
  u.addresses.forEach(a=>a.default=a.id===id);
  renderAddresses();notify('DirecciÃ³n principal actualizada');
}

function savePayment(){
  const u=state.currentUser;
  const type=document.getElementById('payType').value;
  let p;
  if(type==='card'){
    const num=document.getElementById('cardNum').value.replace(/\s/g,'');
    p={id:'p'+Date.now(),type:'card',last4:num.slice(-4),holder:v('cardHolder'),exp:v('cardExp')};
  } else {
    p={id:'p'+Date.now(),type:'transfer',bank:v('bankName'),account:v('bankAccount'),rut:v('bankRut')};
  }
  u.payments.push(p);closeModal('addPaymentModal');renderPayments();
  document.getElementById('dPayments').textContent=u.payments.length;
  notify('MÃ©todo de pago guardado');
}

function deletePayment(id){
  const u=state.currentUser;
  u.payments=u.payments.filter(p=>p.id!==id);
  renderPayments();document.getElementById('dPayments').textContent=u.payments.length;
  notify('MÃ©todo de pago eliminado');
}

function saveAccount(){
  const u=state.currentUser;
  u.name=v('accName');
  const pwd=v('accPwd');
  if(pwd&&pwd.length<6){notify('ContraseÃ±a muy corta','error');return;}
  if(pwd) u.pwd=pwd;
  notify('Cuenta actualizada');
}

function togglePayType(){
  const t=document.getElementById('payType').value;
  document.getElementById('payCardFields').classList.toggle('hidden',t!=='card');
  document.getElementById('payTransferFields').classList.toggle('hidden',t!=='transfer');
}

function formatCard(el){
  let v=el.value.replace(/\D/g,'').slice(0,16);
  el.value=v.match(/.{1,4}/g)?.join(' ')||v;
}

// ===== CHECKOUT =====
function checkout(){
  if(!state.cart.length) return;
  toggleCart();
  const u=state.currentUser;
  const total=state.cart.reduce((s,x)=>s+x.price*x.qty,0);
  const addrOptions=u.addresses.map(a=>`<option value="${a.id}">${a.alias} â€” ${a.street}</option>`).join('');
  const payOptions=u.payments.map(p=>`<option value="${p.id}">${p.type==='card'?`Tarjeta ****${p.last4}`:`${p.bank}`}</option>`).join('');
  document.getElementById('checkoutContent').innerHTML=`
    <div style="margin-bottom:1rem">
      <h4 style="font-size:.9rem;color:var(--ink3);margin-bottom:.5rem;letter-spacing:1px;text-transform:uppercase">Resumen</h4>
      ${state.cart.map(x=>`<div style="display:flex;justify-content:space-between;font-size:.9rem;padding:.3rem 0;border-bottom:1px solid var(--border)"><span>${x.name} (${x.size}, ${x.color}) Ã—${x.qty}</span><span>$${(x.price*x.qty).toLocaleString('es-CL')}</span></div>`).join('')}
      <div style="display:flex;justify-content:space-between;font-weight:500;padding:.8rem 0"><span>Total</span><span style="color:var(--gold)">$${total.toLocaleString('es-CL')}</span></div>
    </div>
    <div class="form-group"><label>DirecciÃ³n de EnvÃ­o</label>
      ${addrOptions?`<select id="coAddr">${addrOptions}</select>`:'<p style="color:var(--red);font-size:.85rem">No tienes direcciones. <a style="color:var(--gold);cursor:pointer" onclick="closeModal(\'checkoutModal\');goPage(\'dashboard\');switchDashTab(\'addresses\',document.querySelector(\'.tab:nth-child(2)\'))">Agregar direcciÃ³n</a></p>'}
    </div>
    <div class="form-group"><label>MÃ©todo de Pago</label>
      ${payOptions?`<select id="coPayment">${payOptions}</select>`:'<p style="color:var(--red);font-size:.85rem">No tienes mÃ©todos de pago. <a style="color:var(--gold);cursor:pointer" onclick="closeModal(\'checkoutModal\');goPage(\'dashboard\');switchDashTab(\'payments\',document.querySelector(\'.tab:nth-child(3)\'))">Agregar mÃ©todo</a></p>'}
    </div>
    ${addrOptions&&payOptions?`<button class="btn-submit" style="width:100%;padding:.8rem" onclick="confirmOrder()">Confirmar Pedido</button>`:''}`;
  openModal('checkoutModal');
}

function confirmOrder(){
  const u=state.currentUser;
  const total=state.cart.reduce((s,x)=>s+x.price*x.qty,0);
  const order={id:'PED-'+String(Date.now()).slice(-4),userId:u.id,items:[...state.cart],total,status:'pending',date:new Date().toISOString().split('T')[0]};
  state.orders.push(order);state.cart=[];
  updateCartUI();closeModal('checkoutModal');
  renderDashboard();goPage('dashboard');
  notify('Â¡Pedido confirmado! '+order.id);
}

// ===== ADMIN =====
function switchAdmin(section,el){
  document.querySelectorAll('[id^=admin-]').forEach(e=>e.classList.add('hidden'));
  document.querySelectorAll('.admin-menu-item').forEach(e=>e.classList.remove('active'));
  document.getElementById('admin-'+section).classList.remove('hidden');
  el.classList.add('active');
  if(section==='products') renderAdminProducts();
  if(section==='orders') renderAdminOrders();
  if(section==='stock') renderAdminStock();
}

function renderAdmin(){
  renderAdminProducts();
}

function renderAdminProducts(){
  const el=document.getElementById('adminProductGrid');
  el.innerHTML=state.products.map(p=>`
    <div class="admin-product-card">
      <div class="img">${p.emoji}</div>
      <div class="info">
        <p style="font-weight:500;font-size:.95rem;margin-bottom:.2rem">${p.name}</p>
        <p style="font-size:.8rem;color:var(--ink3)">${p.type} Â· $${p.price.toLocaleString('es-CL')}</p>
        <div style="display:flex;align-items:center;gap:.5rem;margin-top:.6rem">
          <label class="toggle"><input type="checkbox" ${p.active?'checked':''} onchange="toggleProduct('${p.id}',this.checked)"><span class="toggle-slider"></span></label>
          <span style="font-size:.8rem;color:var(--ink3)">${p.active?'Activo':'Inactivo'}</span>
        </div>
        <div class="pill-list" style="margin-top:.5rem">${p.sizes.map(s=>`<span class="pill">${s}</span>`).join('')}</div>
      </div>
      <div class="actions">
        <button class="btn-sm" onclick="editProduct('${p.id}')">âœï¸ Editar</button>
        <button class="btn-sm" style="color:var(--red);border-color:var(--red)" onclick="deleteProduct('${p.id}')">ðŸ—‘ï¸</button>
      </div>
    </div>`).join('');
}

function toggleProduct(id,active){
  const p=state.products.find(x=>x.id===id);
  if(p) p.active=active;
  notify(`Producto ${active?'activado':'desactivado'}`);
}

function editProduct(id){
  const p=state.products.find(x=>x.id===id);
  state.editProductId=id;
  document.getElementById('addProductTitle').textContent='Editar Producto';
  document.getElementById('pName').value=p.name;
  document.getElementById('pPrice').value=p.price;
  document.getElementById('pType').value=p.type;
  document.getElementById('pMaterial').value=p.material;
  document.getElementById('pStock').value=p.stock;
  document.getElementById('pEmoji').value=p.emoji;
  document.getElementById('pDesc').value=p.desc;
  document.getElementById('pSizes').value=p.sizes.join(', ');
  document.getElementById('pColors').value=p.colors.join(', ');
  document.getElementById('pFeatured').value=p.featured?'true':'false';
  openModal('addProductModal');
}

function saveProduct(){
  const data={
    name:v('pName'),price:+v('pPrice'),type:v('pType'),material:v('pMaterial'),
    stock:+v('pStock'),emoji:v('pEmoji'),desc:v('pDesc'),
    sizes:v('pSizes').split(',').map(s=>s.trim()).filter(Boolean),
    colors:v('pColors').split(',').map(s=>s.trim()).filter(Boolean),
    featured:document.getElementById('pFeatured').value==='true',active:true
  };
  if(state.editProductId){
    const idx=state.products.findIndex(x=>x.id===state.editProductId);
    state.products[idx]={...state.products[idx],...data};
    state.editProductId=null;notify('Producto actualizado');
  } else {
    state.products.push({id:'p'+Date.now(),...data});
    notify('Producto creado');
  }
  closeModal('addProductModal');renderAdminProducts();
  document.getElementById('addProductTitle').textContent='Nuevo Producto';
}

function deleteProduct(id){
  if(confirm('Â¿Eliminar este producto?')){
    state.products=state.products.filter(x=>x.id!==id);
    renderAdminProducts();notify('Producto eliminado');
  }
}

function renderAdminOrders(){
  const el=document.getElementById('adminOrdersBody');
  const statuses=['pending','shipping','delivered'];
  el.innerHTML=state.orders.map(o=>{
    const u=state.users.find(x=>x.id===o.userId);
    return `<tr>
      <td style="font-weight:500">${o.id}</td>
      <td>${u?u.name:'â€”'}</td>
      <td>${o.items.map(i=>i.name+'Ã—'+i.qty).join(', ')}</td>
      <td>$${o.total.toLocaleString('es-CL')}</td>
      <td><select onchange="changeOrderStatus('${o.id}',this.value)" style="font-size:.8rem;padding:.2rem .4rem;border:1px solid var(--border);border-radius:2px;background:var(--bg)">
        ${statuses.map(s=>`<option value="${s}"${o.status===s?' selected':''}>${{pending:'Pendiente',shipping:'En camino',delivered:'Entregado'}[s]}</option>`).join('')}
      </select></td>
      <td><span class="status-badge status-${o.status}">${{pending:'Pendiente',shipping:'En camino',delivered:'Entregado'}[o.status]}</span></td>
    </tr>`;}).join('');
}

function changeOrderStatus(id, status){
  const o=state.orders.find(x=>x.id===id);
  if(o){o.status=status;notify('Estado actualizado');}
}

function renderAdminStock(){
  const el=document.getElementById('adminStockBody');
  el.innerHTML=state.products.map(p=>`<tr>
    <td><strong>${p.emoji}</strong> ${p.name}</td>
    <td>${p.sizes.join(', ')}</td>
    <td>${p.colors.join(', ')}</td>
    <td class="${p.stock<=5?'stock-low':'stock-ok'}">${p.stock} uds.</td>
    <td><span class="status-badge ${p.active?'status-delivered':'status-pending'}">${p.active?'Activo':'Inactivo'}</span></td>
  </tr>`).join('');
}

function saveAdminAccount(){
  state.admin.name=v('adminName');
  state.admin.email=v('adminEmail');
  const pwd=v('adminPwd');
  if(pwd&&pwd.length<6){notify('ContraseÃ±a muy corta','error');return;}
  if(pwd) state.admin.pwd=pwd;
  notify('Cuenta admin actualizada');
}

// ===== MODAL HELPERS =====
function openModal(id){document.getElementById(id).classList.remove('hidden');}
function closeModal(id){document.getElementById(id).classList.add('hidden');}
document.querySelectorAll('.modal-overlay').forEach(m=>m.addEventListener('click',function(e){if(e.target===this)this.classList.add('hidden');}));

// ===== MISC HELPERS =====
function v(id){return document.getElementById(id)?.value||'';}
function showAlert(containerId, msg, type){
  const el=document.getElementById(containerId);
  if(el) el.innerHTML=`<div class="alert alert-${type}">${msg}</div>`;
  setTimeout(()=>{if(el) el.innerHTML='';},3000);
}
function notify(msg, type){
  const c=document.getElementById('notifContainer');
  const d=document.createElement('div');
  d.className='notif-item';
  if(type==='error') d.style.borderLeftColor='var(--red)';
  d.textContent=msg;c.appendChild(d);
  setTimeout(()=>d.remove(),3500);
}

// ===== INIT =====
renderHomeProducts();

