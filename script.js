
    // ============================================
    // GOOGLE SHEETS API CONFIGURATION
    // ============================================
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwGlHyrrl1nldXr4nmAbtZoUOAvhl-DxCTLILkxOjBlIx0I5yu3Bfc8S6KqruqP00pMMw/exec';
    
    // ============================================
    // STATE MANAGEMENT
    // ============================================
    let products = [];
    let orders = [];
    let users = [];
    let cart = [];
    let currentUser = null;
    let selectedUserType = null;
    let currentOrderAddress = {};
    let editingProduct = null;
    
    // Site settings state
    let siteSettings = {
      hero: {
        title: 'Farm Fresh, Swift Delivery!',
        subtitle: 'Get fresh produce delivered in 8 minutes',
        badge: '⚡ Lightning Fast Delivery',
        tag: '📊 Powered by Google Sheets',
        emoji: '🥗',
        bgImage: '',
        gradientFrom: '#10b981',
        gradientTo: '#14b8a6'
      },
      about: {
        enabled: true,
        title: 'About FarmSwift',
        description: 'FarmSwift is your trusted partner for farm-fresh produce delivered straight to your doorstep. We connect local farmers directly with consumers, ensuring the freshest quality while supporting sustainable farming practices.',
        image: '',
        missionTitle: 'Our Mission',
        missionText: 'To deliver farm-fresh produce within minutes while supporting local farmers.',
        visionTitle: 'Our Vision',
        visionText: 'To become the leading platform connecting farms and homes sustainably.'
      }
    };
    
    // Default products with real photos
    const DEFAULT_PRODUCTS = [
      { id: 'PRD-001', product_name: 'Fresh Tomatoes', price: 40, original_price: 50, category: 'vegetables', quantity: '500g', image: 'https://images.unsplash.com/photo-1546470427-227c7369a9b8?w=300&h=300&fit=crop', delivery_time: '8 MINS', description: 'Farm fresh red tomatoes', status: 'approved', farmer_id: 'STORE', farmer_name: 'FarmSwift' },
      { id: 'PRD-002', product_name: 'Green Spinach', price: 30, original_price: 40, category: 'vegetables', quantity: '250g', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop', delivery_time: '8 MINS', description: 'Organic spinach leaves', status: 'approved', farmer_id: 'STORE', farmer_name: 'FarmSwift' },
      { id: 'PRD-003', product_name: 'Fresh Carrots', price: 45, original_price: 55, category: 'vegetables', quantity: '500g', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=300&fit=crop', delivery_time: '8 MINS', description: 'Crunchy orange carrots', status: 'approved', farmer_id: 'STORE', farmer_name: 'FarmSwift' },
      { id: 'PRD-004', product_name: 'Potatoes', price: 35, original_price: 45, category: 'vegetables', quantity: '1kg', image: 'https://images.unsplash.com/photo-1518977676601-b53f82ber64a?w=300&h=300&fit=crop', delivery_time: '8 MINS', description: 'Fresh potatoes', status: 'approved', farmer_id: 'STORE', farmer_name: 'FarmSwift' },
      { id: 'PRD-005', product_name: 'Red Apples', price: 120, original_price: 150, category: 'fruits', quantity: '500g', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop', delivery_time: '8 MINS', description: 'Crispy red apples', status: 'approved', farmer_id: 'STORE', farmer_name: 'FarmSwift' },
      { id: 'PRD-006', product_name: 'Bananas', price: 50, original_price: 60, category: 'fruits', quantity: '6 pcs', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop', delivery_time: '8 MINS', description: 'Ripe yellow bananas', status: 'approved', farmer_id: 'STORE', farmer_name: 'FarmSwift' },
      { id: 'PRD-007', product_name: 'Fresh Oranges', price: 80, original_price: 100, category: 'fruits', quantity: '500g', image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=300&h=300&fit=crop', delivery_time: '8 MINS', description: 'Juicy oranges', status: 'approved', farmer_id: 'STORE', farmer_name: 'FarmSwift' },
      { id: 'PRD-008', product_name: 'Grapes', price: 90, original_price: 110, category: 'fruits', quantity: '500g', image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=300&h=300&fit=crop', delivery_time: '8 MINS', description: 'Sweet seedless grapes', status: 'approved', farmer_id: 'STORE', farmer_name: 'FarmSwift' },
      { id: 'PRD-009', product_name: 'Fresh Milk', price: 60, original_price: 65, category: 'dairy', quantity: '1L', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop', delivery_time: '8 MINS', description: 'Farm fresh milk', status: 'approved', farmer_id: 'STORE', farmer_name: 'FarmSwift' },
      { id: 'PRD-010', product_name: 'Paneer', price: 110, original_price: 130, category: 'dairy', quantity: '200g', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=300&fit=crop', delivery_time: '8 MINS', description: 'Fresh cottage cheese', status: 'approved', farmer_id: 'STORE', farmer_name: 'FarmSwift' },
      { id: 'PRD-011', product_name: 'Curd', price: 45, original_price: 50, category: 'dairy', quantity: '500g', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop', delivery_time: '8 MINS', description: 'Fresh natural curd', status: 'approved', farmer_id: 'STORE', farmer_name: 'FarmSwift' },
      { id: 'PRD-012', product_name: 'Basmati Rice', price: 180, original_price: 220, category: 'grains', quantity: '1kg', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop', delivery_time: '15 MINS', description: 'Premium basmati rice', status: 'approved', farmer_id: 'STORE', farmer_name: 'FarmSwift' },
      { id: 'PRD-013', product_name: 'Wheat Flour', price: 55, original_price: 65, category: 'grains', quantity: '1kg', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=300&fit=crop', delivery_time: '15 MINS', description: 'Fresh ground wheat flour', status: 'approved', farmer_id: 'STORE', farmer_name: 'FarmSwift' },
      { id: 'PRD-014', product_name: 'Red Chilli', price: 70, original_price: 85, category: 'spices', quantity: '100g', image: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=300&h=300&fit=crop', delivery_time: '8 MINS', description: 'Hot red chillies', status: 'approved', farmer_id: 'STORE', farmer_name: 'FarmSwift' },
      { id: 'PRD-015', product_name: 'Turmeric Powder', price: 65, original_price: 80, category: 'spices', quantity: '100g', image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300&h=300&fit=crop', delivery_time: '8 MINS', description: 'Pure turmeric powder', status: 'approved', farmer_id: 'STORE', farmer_name: 'FarmSwift' },
      { id: 'PRD-016', product_name: 'Organic Honey', price: 250, original_price: 300, category: 'organic', quantity: '500g', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop', delivery_time: '15 MINS', description: 'Pure organic honey', status: 'approved', farmer_id: 'STORE', farmer_name: 'FarmSwift' },
      { id: 'PRD-017', product_name: 'Fresh Eggs', price: 85, original_price: 95, category: 'dairy', quantity: '12 pcs', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=300&fit=crop', delivery_time: '8 MINS', description: 'Farm fresh eggs', status: 'approved', farmer_id: 'STORE', farmer_name: 'FarmSwift' },
      { id: 'PRD-018', product_name: 'Broccoli', price: 60, original_price: 75, category: 'organic', quantity: '250g', image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=300&h=300&fit=crop', delivery_time: '8 MINS', description: 'Fresh organic broccoli', status: 'approved', farmer_id: 'STORE', farmer_name: 'FarmSwift' },
      { id: 'PRD-019', product_name: 'Cucumber', price: 25, original_price: 35, category: 'vegetables', quantity: '500g', image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=300&h=300&fit=crop', delivery_time: '8 MINS', description: 'Fresh green cucumbers', status: 'approved', farmer_id: 'STORE', farmer_name: 'FarmSwift' },
      { id: 'PRD-020', product_name: 'Sweet Corn', price: 40, original_price: 50, category: 'vegetables', quantity: '2 pcs', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300&h=300&fit=crop', delivery_time: '8 MINS', description: 'Sweet fresh corn', status: 'approved', farmer_id: 'STORE', farmer_name: 'FarmSwift' }
    ];

    // Default config for Element SDK
    const defaultConfig = {
      site_title: 'FarmSwift',
      hero_text: 'Farm Fresh, Swift Delivery! �����',
      primary_color: '#10b981',
      secondary_color: '#ffffff',
      text_color: '#1f2937',
      accent_color: '#f59e0b',
      background_color: '#f9fafb'
    };

    // ============================================
    // GOOGLE SHEETS API FUNCTIONS
    // ============================================
    
    async function fetchFromSheet(sheetName) {
      try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getAll&sheet=${sheetName}`);
        const result = await response.json();
        if (result.success) {
          return result.data || [];
        }
        console.error('Fetch error:', result.error);
        return [];
      } catch (error) {
        console.error('Network error:', error);
        return [];
      }
    }

    async function createRecord(sheetName, record) {
      try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'create', sheet: sheetName, record }),
          mode: 'no-cors'
        });
        return { success: true };
      } catch (error) {
        console.error('Create error:', error);
        return { success: false, error: error.message };
      }
    }

    async function updateRecord(sheetName, record) {
      try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'update', sheet: sheetName, record }),
          mode: 'no-cors'
        });
        return { success: true };
      } catch (error) {
        console.error('Update error:', error);
        return { success: false, error: error.message };
      }
    }

    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    
    function generateId(prefix) {
      return `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    }

    // Image upload preview functions
    // Site settings image preview functions
    function previewHeroBgImage(input) {
      if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const imageData = e.target.result;
          document.getElementById('hero-bg-image-data').value = imageData;
          document.getElementById('hero-bg-preview-img').src = imageData;
          document.getElementById('hero-bg-preview').classList.remove('hidden');
          updateHeroPreview();
        };
        reader.readAsDataURL(input.files[0]);
      }
    }

    function previewAboutImage(input) {
      if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const imageData = e.target.result;
          document.getElementById('about-image-data').value = imageData;
          document.getElementById('about-image-preview-img').src = imageData;
          document.getElementById('about-image-preview').classList.remove('hidden');
        };
        reader.readAsDataURL(input.files[0]);
      }
    }

    function updateHeroPreview() {
      const preview = document.getElementById('hero-preview');
      const titleEl = document.getElementById('hero-preview-title');
      const subtitleEl = document.getElementById('hero-preview-subtitle');
      const badgeEl = document.getElementById('hero-preview-badge');
      const emojiEl = document.getElementById('hero-preview-emoji');
      
      const title = document.getElementById('hero-title').value || siteSettings.hero.title;
      const subtitle = document.getElementById('hero-subtitle').value || siteSettings.hero.subtitle;
      const badge = document.getElementById('hero-badge').value || siteSettings.hero.badge;
      const emoji = document.getElementById('hero-emoji').value || siteSettings.hero.emoji;
      const bgImage = document.getElementById('hero-bg-image-data').value;
      const gradientFrom = document.getElementById('hero-gradient-from').value;
      const gradientTo = document.getElementById('hero-gradient-to').value;
      
      titleEl.textContent = title;
      subtitleEl.textContent = subtitle;
      badgeEl.textContent = badge;
      emojiEl.textContent = emoji;
      
      // Reset styles first
      preview.style.backgroundImage = '';
      preview.style.background = '';
      
      if (bgImage && bgImage.length > 0) {
        // Show uploaded image with gradient overlay
        preview.style.backgroundImage = `linear-gradient(to right, ${gradientFrom}dd, ${gradientTo}bb), url("${bgImage}")`;
        preview.style.backgroundSize = 'cover';
        preview.style.backgroundPosition = 'center';
        preview.style.backgroundRepeat = 'no-repeat';
      } else {
        // Just show gradient
        preview.style.background = `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`;
      }
    }

    function applyHeroSettings() {
      const heroBanner = document.getElementById('hero-banner');
      const heroOverlay = document.getElementById('hero-overlay');
      const heroText = document.getElementById('hero-text');
      const heroSubtitle = document.getElementById('hero-subtitle-text');
      const heroBadge = document.getElementById('hero-badge-text');
      const heroTag = document.getElementById('hero-tag-text');
      const heroEmoji = document.getElementById('hero-emoji-display');
      
      if (heroText) heroText.textContent = siteSettings.hero.title;
      if (heroSubtitle) heroSubtitle.textContent = siteSettings.hero.subtitle;
      if (heroBadge) heroBadge.textContent = siteSettings.hero.badge;
      if (heroTag) heroTag.textContent = siteSettings.hero.tag;
      if (heroEmoji) heroEmoji.textContent = siteSettings.hero.emoji;
      
      if (heroBanner) {
        // Reset all background styles first
        heroBanner.style.backgroundImage = '';
        heroBanner.style.background = '';
        
        if (siteSettings.hero.bgImage && siteSettings.hero.bgImage.length > 0) {
          // Apply background image with proper CSS
          heroBanner.style.backgroundImage = `url("${siteSettings.hero.bgImage}")`;
          heroBanner.style.backgroundSize = 'cover';
          heroBanner.style.backgroundPosition = 'center';
          heroBanner.style.backgroundRepeat = 'no-repeat';
          // Show gradient overlay on top of image
          if (heroOverlay) {
            heroOverlay.style.background = `linear-gradient(to right, ${siteSettings.hero.gradientFrom}dd, ${siteSettings.hero.gradientTo}bb)`;
            heroOverlay.style.display = 'block';
          }
        } else {
          // No image - use gradient as background
          heroBanner.style.background = `linear-gradient(to right, ${siteSettings.hero.gradientFrom}, ${siteSettings.hero.gradientTo})`;
          if (heroOverlay) {
            heroOverlay.style.background = 'transparent';
          }
        }
      }
    }

    function applyAboutSettings() {
      const aboutSection = document.getElementById('about-section');
      if (!aboutSection) return;
      
      if (!siteSettings.about.enabled) {
        aboutSection.classList.add('hidden');
        return;
      }
      
      aboutSection.classList.remove('hidden');
      
      const titleEl = document.getElementById('about-section-title');
      const descEl = document.getElementById('about-section-description');
      const imageContainer = document.getElementById('about-image-container');
      const missionTitleEl = document.getElementById('about-mission-title-display');
      const missionTextEl = document.getElementById('about-mission-text-display');
      const visionTitleEl = document.getElementById('about-vision-title-display');
      const visionTextEl = document.getElementById('about-vision-text-display');
      
      if (titleEl) titleEl.textContent = siteSettings.about.title;
      if (descEl) descEl.textContent = siteSettings.about.description;
      if (missionTitleEl) missionTitleEl.textContent = siteSettings.about.missionTitle;
      if (missionTextEl) missionTextEl.textContent = siteSettings.about.missionText;
      if (visionTitleEl) visionTitleEl.textContent = siteSettings.about.visionTitle;
      if (visionTextEl) visionTextEl.textContent = siteSettings.about.visionText;
      
      if (imageContainer && siteSettings.about.image) {
        imageContainer.innerHTML = `<img src="${siteSettings.about.image}" alt="About" class="w-full h-full object-cover">`;
      } else if (imageContainer && !siteSettings.about.image) {
        imageContainer.innerHTML = '<span class="text-8xl">🌾</span>';
      }
    }

    function resetHeroSettings() {
      siteSettings.hero = {
        title: 'Farm Fresh, Swift Delivery!',
        subtitle: 'Get fresh produce delivered in 8 minutes',
        badge: '⚡ Lightning Fast Delivery',
        tag: '📊 Powered by Google Sheets',
        emoji: '🥗',
        bgImage: '',
        gradientFrom: '#10b981',
        gradientTo: '#14b8a6'
      };
      loadSiteSettingsToForm();
      applyHeroSettings();
      showToast('Hero settings reset to default! 🔄');
    }

    function loadSiteSettingsToForm() {
      // Hero settings
      document.getElementById('hero-title').value = siteSettings.hero.title;
      document.getElementById('hero-subtitle').value = siteSettings.hero.subtitle;
      document.getElementById('hero-badge').value = siteSettings.hero.badge;
      document.getElementById('hero-tag').value = siteSettings.hero.tag;
      document.getElementById('hero-emoji').value = siteSettings.hero.emoji;
      document.getElementById('hero-gradient-from').value = siteSettings.hero.gradientFrom;
      document.getElementById('hero-gradient-from-text').value = siteSettings.hero.gradientFrom;
      document.getElementById('hero-gradient-to').value = siteSettings.hero.gradientTo;
      document.getElementById('hero-gradient-to-text').value = siteSettings.hero.gradientTo;
      document.getElementById('hero-bg-image-data').value = siteSettings.hero.bgImage;
      
      if (siteSettings.hero.bgImage) {
        document.getElementById('hero-bg-preview-img').src = siteSettings.hero.bgImage;
        document.getElementById('hero-bg-preview').classList.remove('hidden');
      }
      
      // About settings
      document.getElementById('about-enabled').checked = siteSettings.about.enabled;
      document.getElementById('about-title').value = siteSettings.about.title;
      document.getElementById('about-description').value = siteSettings.about.description;
      document.getElementById('about-mission-title').value = siteSettings.about.missionTitle;
      document.getElementById('about-mission-text').value = siteSettings.about.missionText;
      document.getElementById('about-vision-title').value = siteSettings.about.visionTitle;
      document.getElementById('about-vision-text').value = siteSettings.about.visionText;
      document.getElementById('about-image-data').value = siteSettings.about.image;
      
      if (siteSettings.about.image) {
        document.getElementById('about-image-preview-img').src = siteSettings.about.image;
        document.getElementById('about-image-preview').classList.remove('hidden');
      }
      
      updateHeroPreview();
    }

    function previewFarmerImage(input) {
      if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const imageData = e.target.result;
          document.getElementById('product-image-data').value = imageData;
          document.getElementById('farmer-preview-img').src = imageData;
          document.getElementById('farmer-image-preview').classList.remove('hidden');
        };
        reader.readAsDataURL(input.files[0]);
      }
    }

    function previewAdminImage(input) {
      if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const imageData = e.target.result;
          document.getElementById('admin-product-image-data').value = imageData;
          document.getElementById('admin-preview-img').src = imageData;
          document.getElementById('admin-image-preview').classList.remove('hidden');
        };
        reader.readAsDataURL(input.files[0]);
      }
    }

    function previewEditImage(input) {
      if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const imageData = e.target.result;
          document.getElementById('edit-product-image').value = imageData;
          document.getElementById('edit-product-preview-img').src = imageData;
        };
        reader.readAsDataURL(input.files[0]);
      }
    }

    function showToast(message, type = 'success') {
      const container = document.getElementById('toast-container');
      const toast = document.createElement('div');
      toast.className = `px-4 py-3 rounded-xl shadow-lg text-sm font-medium transform transition-all duration-300 ${
        type === 'success' ? 'bg-emerald-600 text-white' : 
        type === 'error' ? 'bg-red-600 text-white' : 
        'bg-amber-500 text-white'
      }`;
      toast.textContent = message;
      container.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }

    // ============================================
    // DATA LOADING
    // ============================================
    
    async function loadAllData() {
      try {
        const [productsData, ordersData, usersData] = await Promise.all([
          fetchFromSheet('Products'),
          fetchFromSheet('Orders'),
          fetchFromSheet('Users')
        ]);
        
        // Merge default products with Google Sheets products
        const sheetProducts = productsData.filter(p => p.product_name && p.status === 'approved');
        
        // Start with default products, then add any from sheets that aren't duplicates
        products = [...DEFAULT_PRODUCTS];
        sheetProducts.forEach(sp => {
          if (!products.find(p => p.id === sp.id)) {
            products.push(sp);
          }
        });
        
        orders = ordersData;
        users = usersData;
        
        return true;
      } catch (error) {
        console.error('Failed to load data:', error);
        // Even if sheets fail, show default products
        products = [...DEFAULT_PRODUCTS];
        return true;
      }
    }

    async function refreshProducts() {
      const refreshIcon = document.getElementById('refresh-icon');
      refreshIcon.textContent = '���';
      
      products = await fetchFromSheet('Products');
      products = products.filter(p => p.product_name && p.status === 'approved');
      renderProducts();
      
      refreshIcon.textContent = '🔄';
      showToast('Products refreshed! ����');
    }

    // ============================================
    // RENDER FUNCTIONS
    // ============================================
    
    function renderProducts() {
      const grid = document.getElementById('products-grid');
      const noProducts = document.getElementById('no-products');
      const loading = document.getElementById('products-loading');
      const countEl = document.getElementById('product-count');
      const searchInput = document.getElementById('search-input');
      
      loading.classList.add('hidden');
      
      // Only show approved products to customers
      let filteredProducts = products.filter(p => p.status === 'approved');
      const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
      const activeCategory = document.querySelector('.category-btn.bg-emerald-100');
      const category = activeCategory ? activeCategory.dataset.category : 'all';
      
      if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
          p.product_name?.toLowerCase().includes(searchTerm) || 
          p.description?.toLowerCase().includes(searchTerm)
        );
      }
      
      if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
      }
      
      countEl.textContent = `${filteredProducts.length} items available`;
      
      if (filteredProducts.length === 0) {
        grid.classList.add('hidden');
        noProducts.classList.remove('hidden');
        return;
      }
      
      grid.classList.remove('hidden');
      noProducts.classList.add('hidden');
      
      grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 cursor-pointer">
          <div class="relative bg-gray-100">
            <span class="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 z-10">
              ⚡ ${product.delivery_time || '8 MINS'}
            </span>
            ${product.image && product.image.startsWith('http') 
              ? `<div class="w-full h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img src="${product.image}" alt="${product.product_name}" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<div class=\\'text-5xl text-center py-6\\'>🥬</div>'">
                </div>`
              : `<div class="text-5xl text-center py-6">${product.image || '🥬'}</div>`
            }
          </div>
          <div class="p-3">
            <h3 class="font-semibold text-gray-800 text-sm truncate">${product.product_name}</h3>
            <p class="text-xs text-gray-500 mb-2">${product.quantity || ''}</p>
            <div class="flex items-center justify-between">
              <div>
                <span class="font-bold text-gray-800">₹${product.price}</span>
                ${product.original_price ? `<span class="text-xs text-gray-400 line-through ml-1">₹${product.original_price}</span>` : ''}
              </div>
              <button onclick="addToCart('${product.id}')" class="add-btn bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-emerald-600 hover:text-white transition">
                + ADD
              </button>
            </div>
          </div>
        </div>
      `).join('');
    }

    function addToCart(productId) {
      const product = products.find(p => p.id === productId);
      if (!product) return;
      
      const existingItem = cart.find(item => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          productId,
          name: product.product_name,
          price: parseFloat(product.price),
          image: product.image || '🥬',
          quantity: 1,
          farmerId: product.farmer_id
        });
      }
      
      updateCartUI();
      showToast(`${product.product_name} added! ⚡`);
    }

    function updateCartUI() {
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      document.getElementById('cart-count').textContent = count;
      document.getElementById('cart-total').textContent = `₹${total}`;
      document.getElementById('cart-total-sidebar').textContent = `₹${total}`;
      document.getElementById('payment-total').textContent = `₹${total}`;
      
      const cartItems = document.getElementById('cart-items');
      const cartEmpty = document.getElementById('cart-empty');
      const cartFooter = document.getElementById('cart-footer');
      
      if (cart.length === 0) {
        cartItems.classList.add('hidden');
        cartEmpty.classList.remove('hidden');
        cartFooter.classList.add('hidden');
      } else {
        cartItems.classList.remove('hidden');
        cartEmpty.classList.add('hidden');
        cartFooter.classList.remove('hidden');
        
        cartItems.innerHTML = cart.map((item, index) => `
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            ${item.image && item.image.startsWith('http') 
              ? `<div class="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                  <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<span class=\\'text-2xl flex items-center justify-center h-full\\'>���</span>'">
                </div>`
              : `<span class="text-3xl">${item.image || '🥬'}</span>`
            }
            <div class="flex-1">
              <h4 class="font-medium text-gray-800 text-sm">${item.name}</h4>
              <p class="text-emerald-600 font-bold">₹${item.price}</p>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="updateCartQuantity(${index}, -1)" class="w-8 h-8 bg-gray-200 rounded-lg font-bold hover:bg-gray-300 transition">-</button>
              <span class="w-8 text-center font-medium">${item.quantity}</span>
              <button onclick="updateCartQuantity(${index}, 1)" class="w-8 h-8 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition">+</button>
            </div>
          </div>
        `).join('');
      }
    }

    function updateCartQuantity(index, delta) {
      cart[index].quantity += delta;
      if (cart[index].quantity <= 0) cart.splice(index, 1);
      updateCartUI();
    }

    function renderFarmerProducts() {
      const list = document.getElementById('farmer-products-list');
      const noProducts = document.getElementById('farmer-no-products');
      
      const farmerProducts = products.filter(p => p.farmer_id === currentUser?.id);
      
      // Update stats
      const totalProducts = farmerProducts.length;
      const approved = farmerProducts.filter(p => p.status === 'approved').length;
      const pending = farmerProducts.filter(p => p.status === 'pending').length;
      const earnings = farmerProducts.filter(p => p.status === 'approved').reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) * 5; // Estimated earnings
      
      document.getElementById('farmer-stat-products').textContent = totalProducts;
      document.getElementById('farmer-stat-approved').textContent = approved;
      document.getElementById('farmer-stat-pending').textContent = pending;
      document.getElementById('farmer-stat-earnings').textContent = `₹${earnings.toLocaleString()}`;
      
      if (farmerProducts.length === 0) {
        list.classList.add('hidden');
        noProducts.classList.remove('hidden');
        return;
      }
      
      list.classList.remove('hidden');
      noProducts.classList.add('hidden');
      
      list.innerHTML = farmerProducts.map(p => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
          <div class="flex items-center gap-3">
            ${p.image && p.image.startsWith('http') 
              ? `<div class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                  <img src="${p.image}" alt="${p.product_name}" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<span class=\\'text-2xl flex items-center justify-center h-full\\'>🥬</span>'">
                </div>`
              : `<span class="text-3xl">${p.image || '🥬'}</span>`
            }
            <div>
              <h4 class="font-medium text-gray-800">${p.product_name}</h4>
              <p class="text-sm text-gray-500">${p.quantity} • ₹${p.price}</p>
              <p class="text-xs text-gray-400">${p.category}</p>
            </div>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-medium ${p.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : p.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}">
            ${(p.status || 'pending').toUpperCase()}
          </span>
        </div>
      `).join('');
    }

    function renderDeliveryOrders() {
      const list = document.getElementById('delivery-orders-list');
      const noOrders = document.getElementById('delivery-no-orders');
      
      // Show orders assigned to this delivery partner (check both id and visually log for debugging)
      console.log('Current User:', currentUser);
      console.log('All Orders:', orders);
      
      // Match by delivery_partner field - check multiple possible matches
      const myOrders = orders.filter(o => {
        const partnerId = o.delivery_partner;
        const userId = currentUser?.id;
        const userEmail = currentUser?.email;
        // Match by ID or email
        return partnerId === userId || partnerId === userEmail || 
               (partnerId && userId && partnerId.toString() === userId.toString());
      });
      
      console.log('My Orders:', myOrders);
      
      // Update stats
      const assigned = myOrders.filter(o => o.status === 'assigned').length;
      const pickedUp = myOrders.filter(o => o.status === 'picked_up').length;
      const delivered = myOrders.filter(o => o.status === 'delivered').length;
      const earnings = myOrders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + (parseFloat(o.total) * 0.1), 0); // 10% commission
      
      document.getElementById('delivery-stat-assigned').textContent = assigned;
      document.getElementById('delivery-stat-picked').textContent = pickedUp;
      document.getElementById('delivery-stat-delivered').textContent = delivered;
      document.getElementById('delivery-stat-earnings').textContent = `₹${Math.round(earnings)}`;
      
      if (myOrders.length === 0) {
        list.classList.add('hidden');
        noOrders.classList.remove('hidden');
        return;
      }
      
      list.classList.remove('hidden');
      noOrders.classList.add('hidden');
      
      list.innerHTML = myOrders.map(o => `
        <div class="p-4 bg-gray-50 rounded-xl border-2 ${o.status === 'delivered' ? 'border-emerald-200' : o.status === 'picked_up' ? 'border-blue-200' : 'border-amber-200'}">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h4 class="font-bold text-gray-800">${o.order_id}</h4>
              <p class="text-sm text-gray-500">${o.customer_name}</p>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-medium ${o.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : o.status === 'picked_up' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}">
              ${(o.status || 'pending').toUpperCase().replace('_', ' ')}
            </span>
          </div>
          <div class="grid grid-cols-2 gap-2 mb-3">
            <div class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-xl">
              <p class="text-xs opacity-80">🎫 Delivery ID</p>
              <p class="text-lg font-mono font-bold">${o.delivery_id}</p>
            </div>
            ${o.assignment_id ? `
            <div class="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-3 rounded-xl">
              <p class="text-xs opacity-80">📋 Assignment ID</p>
              <p class="text-lg font-mono font-bold">${o.assignment_id}</p>
            </div>
            ` : '<div></div>'}
          </div>
          <p class="text-sm text-gray-600 mb-1">📍 ${o.address}</p>
          <p class="text-sm text-gray-600 mb-1">📞 ${o.phone}</p>
          ${o.landmark ? `<p class="text-sm text-gray-600 mb-1">🏠 ${o.landmark}</p>` : ''}
          <div class="flex items-center justify-between mt-3 pt-3 border-t">
            <span class="font-bold text-emerald-600 text-lg">₹${o.total}</span>
            ${o.status === 'assigned' ? `
              <button onclick="updateOrderStatus('${o.id}', 'picked_up')" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2">
                📦 Mark as Picked Up
              </button>
            ` : o.status === 'picked_up' ? `
              <button onclick="updateOrderStatus('${o.id}', 'delivered')" class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition flex items-center gap-2">
                ✅ Mark as Delivered
              </button>
            ` : '<span class="text-emerald-600 font-medium flex items-center gap-1">✅ Delivered</span>'}
          </div>
        </div>
      `).join('');
    }

    function renderDarkstoreOrders() {
      const list = document.getElementById('darkstore-orders-list');
      const noOrders = document.getElementById('darkstore-no-orders');
      
      // Update stats
      const totalOrders = orders.length;
      const pending = orders.filter(o => o.status !== 'delivered').length;
      const completed = orders.filter(o => o.status === 'delivered').length;
      const revenue = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
      
      document.getElementById('darkstore-stat-total').textContent = totalOrders;
      document.getElementById('darkstore-stat-pending').textContent = pending;
      document.getElementById('darkstore-stat-completed').textContent = completed;
      document.getElementById('darkstore-stat-revenue').textContent = `₹${revenue.toLocaleString()}`;
      
      if (orders.length === 0) {
        list.classList.add('hidden');
        noOrders.classList.remove('hidden');
        return;
      }
      
      list.classList.remove('hidden');
      noOrders.classList.add('hidden');
      
      list.innerHTML = orders.map(o => {
        const assignedPartner = users.find(u => u.id === o.delivery_partner);
        return `
        <div class="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
          <div class="flex items-center justify-between mb-2">
            <div>
              <h4 class="font-bold text-gray-800">${o.order_id}</h4>
              <p class="text-xs text-blue-600 font-mono">🎫 ${o.delivery_id}</p>
              ${o.assignment_id ? `<p class="text-xs text-purple-600 font-mono">�� ${o.assignment_id}</p>` : ''}
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-medium ${o.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : o.status === 'picked_up' ? 'bg-blue-100 text-blue-700' : o.status === 'assigned' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}">
              ${(o.status || 'pending').toUpperCase().replace('_', ' ')}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600">💰 ₹${o.total} • 👤 ${o.customer_name}</p>
            ${assignedPartner ? `<p class="text-xs text-purple-600">🚴 ${assignedPartner.name}</p>` : ''}
          </div>
        </div>
      `}).join('');
    }

    async function updateOrderStatus(orderId, status) {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        order.status = status;
        order.tracking = status === 'delivered' ? '✅ Order delivered' : order.tracking;
        await updateRecord('Orders', order);
        showToast('Order updated! ⚡');
        renderDeliveryOrders();
      }
    }

    // ============================================
    // EVENT HANDLERS
    // ============================================
    
    function setupEventListeners() {
      // Cart
      document.getElementById('cart-btn').addEventListener('click', () => document.getElementById('cart-sidebar').classList.remove('hidden'));
      document.getElementById('close-cart').addEventListener('click', () => document.getElementById('cart-sidebar').classList.add('hidden'));
      document.getElementById('cart-overlay').addEventListener('click', () => document.getElementById('cart-sidebar').classList.add('hidden'));
      
      // Search
      document.getElementById('search-input').addEventListener('input', renderProducts);
      
      // Refresh
      document.getElementById('refresh-btn').addEventListener('click', refreshProducts);
      
      // Categories
      document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('bg-emerald-100'));
          btn.classList.add('bg-emerald-100');
          renderProducts();
        });
      });
      
      // Login buttons
      document.getElementById('sell-product-btn').addEventListener('click', () => { selectedUserType = 'farmer'; showLoginModal('Farmer', '🌾'); });
      document.getElementById('delivery-login-btn').addEventListener('click', () => { selectedUserType = 'delivery'; showLoginModal('Delivery Partner', '🚴'); });
      document.getElementById('darkstore-login-btn').addEventListener('click', () => { selectedUserType = 'darkstore'; showLoginModal('Dark Store', '🏪'); });
      document.getElementById('login-btn').addEventListener('click', () => { selectedUserType = 'customer'; showLoginModal('Customer', '���'); });
      
      document.getElementById('login-overlay').addEventListener('click', hideLoginModal);
      document.getElementById('back-to-home').addEventListener('click', hideLoginModal);
      
      document.getElementById('register-toggle').addEventListener('click', () => {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('register-form').classList.remove('hidden');
        document.getElementById('register-user-type').textContent = `Register as ${selectedUserType}`;
      });
      
      document.getElementById('login-toggle').addEventListener('click', () => {
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
      });
      
      // Login form
      document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('login-submit-btn');
        btn.disabled = true;
        btn.textContent = 'Logging in...';
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Admin check
        if (email === 'admin' && password === 'admin123') {
          currentUser = { id: 'ADMIN', user_type: 'admin', name: 'Admin' };
          hideLoginModal();
          setTimeout(() => {
            showAdminDashboard();
          }, 100);
          showToast('Welcome Admin! ⚡');
          btn.disabled = false;
          btn.textContent = 'Login';
          return;
        }
        
        // Check users from Google Sheets
        const user = users.find(u => 
          u.email === email && u.password === password && u.user_type === selectedUserType
        );
        
        if (user) {
          currentUser = user;
          hideLoginModal();
          setTimeout(() => {
            showDashboard(selectedUserType);
          }, 100);
          showToast(`Welcome ${user.name}! ⚡`);
        } else {
          // For demo: auto-create user if not found
          const demoUser = {
            id: generateId('USR'),
            user_type: selectedUserType,
            name: email.split('@')[0] || email,
            email: email,
            password: password
          };
          currentUser = demoUser;
          hideLoginModal();
          setTimeout(() => {
            showDashboard(selectedUserType);
          }, 100);
          showToast(`Demo login as ${selectedUserType}! ⚡`);
        }
        
        btn.disabled = false;
        btn.textContent = 'Login';
      });
      
      // Register form
      document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('register-submit-btn');
        btn.disabled = true;
        btn.textContent = 'Registering...';
        
        const userData = {
          id: generateId('USR'),
          user_type: selectedUserType,
          name: document.getElementById('register-name').value,
          email: document.getElementById('register-email').value,
          phone: document.getElementById('register-phone').value,
          password: document.getElementById('register-password').value,
          created_at: new Date().toISOString()
        };
        
        await createRecord('Users', userData);
        showToast('Registration successful! Please login ⚡');
        
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('register-form').reset();
        
        btn.disabled = false;
        btn.textContent = 'Register';
        
        // Refresh users
        users = await fetchFromSheet('Users');
      });
      
      // Checkout
      document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
          showToast('Cart is empty', 'warning');
          return;
        }
        document.getElementById('cart-sidebar').classList.add('hidden');
        document.getElementById('address-modal').classList.remove('hidden');
      });
      
      // Initialize payment modal when opened
      function initPaymentModal() {
        // Default to UPI selected
        selectPaymentMethod('upi');
        // Update payment total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('payment-total').textContent = `₹${total}`;
      }
      
      // Address form
      document.getElementById('address-form').addEventListener('submit', (e) => {
        e.preventDefault();
        currentOrderAddress = {
          name: document.getElementById('customer-name').value,
          phone: document.getElementById('customer-phone').value,
          address: document.getElementById('customer-address').value,
          landmark: document.getElementById('customer-landmark').value
        };
        document.getElementById('address-modal').classList.add('hidden');
        document.getElementById('payment-modal').classList.remove('hidden');
        initPaymentModal();
      });
      
      // Place order
      document.getElementById('place-order-btn').addEventListener('click', async () => {
        const btn = document.getElementById('place-order-btn');
        btn.disabled = true;
        btn.innerHTML = '<span class="loading-spinner"></span> Placing order...';
        
        const orderId = generateId('ORD');
        const deliveryId = generateId('DID');
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Do NOT auto-assign - admin will manually assign delivery partner
        const orderData = {
          id: orderId,
          order_id: orderId,
          delivery_id: deliveryId,
          customer_name: currentOrderAddress.name,
          phone: currentOrderAddress.phone,
          address: currentOrderAddress.address,
          landmark: currentOrderAddress.landmark,
          items: JSON.stringify(cart),
          total: total,
          status: 'pending',
          delivery_partner: '',
          assignment_id: '',
          tracking: 'Order placed - Awaiting assignment',
          created_at: new Date().toISOString()
        };
        
        await createRecord('Orders', orderData);
        
        document.getElementById('payment-modal').classList.add('hidden');
        document.getElementById('success-modal').classList.remove('hidden');
        document.getElementById('success-order-id').textContent = orderId;
        document.getElementById('success-delivery-id').textContent = deliveryId;
        
        cart = [];
        updateCartUI();
        utrInput.value = '';
        showToast('Order placed successfully! ���');
        
        btn.disabled = false;
        btn.innerHTML = '<span id="place-order-text">Place Order</span><span>⚡</span>';
        
        // Refresh orders
        orders = await fetchFromSheet('Orders');
      });
      
      document.getElementById('close-success').addEventListener('click', () => {
        document.getElementById('success-modal').classList.add('hidden');
      });
      
      // Add product form (Farmer)
      document.getElementById('add-product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('add-product-btn');
        btn.disabled = true;
        btn.textContent = 'Adding...';
        
        const productData = {
          id: generateId('PRD'),
          product_name: document.getElementById('product-name').value,
          price: parseFloat(document.getElementById('product-price').value),
          original_price: '',
          category: document.getElementById('product-category').value,
          quantity: document.getElementById('product-quantity').value,
          image: document.getElementById('product-image-data').value || '🥬',
          delivery_time: document.getElementById('product-delivery-time').value,
          description: document.getElementById('product-description').value,
          status: 'approved',
          farmer_id: currentUser?.id || 'STORE',
          farmer_name: currentUser?.name || 'Store',
          created_at: new Date().toISOString()
        };
        
        await createRecord('Products', productData);
        showToast('Product added to Google Sheets! ⚡');
        
        e.target.reset();
        document.getElementById('product-image-data').value = '';
        document.getElementById('farmer-image-preview').classList.add('hidden');
        btn.disabled = false;
        btn.textContent = 'Add Product to Google Sheets';
        
        // Refresh products
        products = await fetchFromSheet('Products');
        products = products.filter(p => p.product_name && p.status === 'approved');
        renderProducts();
        renderFarmerProducts();
      });
      
      // Verify delivery ID (Dark Store)
      document.getElementById('verify-delivery-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const deliveryId = document.getElementById('verify-delivery-id').value.toUpperCase();
        const order = orders.find(o => o.delivery_id === deliveryId);
        
        const detailsEl = document.getElementById('verified-order-details');
        
        if (order) {
          detailsEl.classList.remove('hidden');
          detailsEl.innerHTML = `
            <div class="text-center mb-4">
              <span class="text-4xl">✅</span>
              <h3 class="font-bold text-emerald-700 text-lg mt-2">Verified!</h3>
            </div>
            <div class="space-y-2 text-sm">
              <p><strong>Order ID:</strong> ${order.order_id}</p>
              <p><strong>Customer:</strong> ${order.customer_name}</p>
              <p><strong>Phone:</strong> ${order.phone}</p>
              <p><strong>Address:</strong> ${order.address}</p>
              <p><strong>Total:</strong> ₹${order.total}</p>
              <p><strong>Status:</strong> ${order.status}</p>
            </div>
          `;
        } else {
          showToast('Delivery ID not found', 'error');
          detailsEl.classList.add('hidden');
        }
      });
      
      // Logout buttons
      document.getElementById('farmer-logout').addEventListener('click', logout);
      document.getElementById('delivery-logout').addEventListener('click', logout);
      document.getElementById('darkstore-logout').addEventListener('click', logout);
      
      // Refresh buttons for dashboards
      document.getElementById('farmer-refresh').addEventListener('click', async () => {
        products = await fetchFromSheet('Products');
        products = products.filter(p => p.product_name);
        renderFarmerProducts();
        showToast('Refreshed! 🔄');
      });
      
      document.getElementById('delivery-refresh').addEventListener('click', async () => {
        showToast('Refreshing orders...', 'warning');
        const freshOrders = await fetchFromSheet('Orders');
        if (freshOrders && freshOrders.length > 0) {
          orders = freshOrders;
        }
        renderDeliveryOrders();
        showToast('Orders refreshed! 🔄');
      });
      
      document.getElementById('darkstore-refresh').addEventListener('click', async () => {
        orders = await fetchFromSheet('Orders');
        renderDarkstoreOrders();
        showToast('Refreshed! 🔄');
      });
    }

    function showLoginModal(typeName, emoji) {
      document.getElementById('login-modal').classList.remove('hidden');
      document.getElementById('register-form').classList.add('hidden');
      document.getElementById('login-form').classList.remove('hidden');
      document.getElementById('login-user-type').innerHTML = `${emoji} Login as ${typeName}`;
    }

    function hideLoginModal() {
      document.getElementById('login-modal').classList.add('hidden');
      document.getElementById('login-email').value = '';
      document.getElementById('login-password').value = '';
    }

    function showDashboard(type) {
      // Hide all views first
      const customerView = document.getElementById('customer-view');
      const farmerDash = document.getElementById('farmer-dashboard');
      const deliveryDash = document.getElementById('delivery-dashboard');
      const darkstoreDash = document.getElementById('darkstore-dashboard');
      const adminDash = document.getElementById('admin-dashboard');
      
      // Hide all with both class and style
      customerView.classList.add('hidden');
      customerView.style.display = 'none';
      farmerDash.classList.add('hidden');
      farmerDash.style.display = 'none';
      deliveryDash.classList.add('hidden');
      deliveryDash.style.display = 'none';
      darkstoreDash.classList.add('hidden');
      darkstoreDash.style.display = 'none';
      adminDash.classList.add('hidden');
      adminDash.style.display = 'none';
      
      // Show the appropriate dashboard
      if (type === 'farmer') {
        farmerDash.classList.remove('hidden');
        farmerDash.style.display = 'block';
        document.getElementById('farmer-name-display').textContent = currentUser?.name || 'Farmer';
        renderFarmerProducts();
      } else if (type === 'delivery') {
        deliveryDash.classList.remove('hidden');
        deliveryDash.style.display = 'block';
        document.getElementById('delivery-name-display').textContent = currentUser?.name || 'Delivery Partner';
        // Fetch fresh orders from Google Sheets and then render
        (async () => {
          showToast('Loading your orders...', 'warning');
          const freshOrders = await fetchFromSheet('Orders');
          if (freshOrders && freshOrders.length > 0) {
            orders = freshOrders;
          }
          renderDeliveryOrders();
        })();
      } else if (type === 'darkstore') {
        darkstoreDash.classList.remove('hidden');
        darkstoreDash.style.display = 'block';
        document.getElementById('darkstore-name-display').textContent = currentUser?.name || 'Dark Store';
        renderDarkstoreOrders();
      }
      
      console.log('Dashboard shown:', type);
    }

    function showCustomerView() {
      const customerView = document.getElementById('customer-view');
      const farmerDash = document.getElementById('farmer-dashboard');
      const deliveryDash = document.getElementById('delivery-dashboard');
      const darkstoreDash = document.getElementById('darkstore-dashboard');
      const adminDash = document.getElementById('admin-dashboard');
      
      // Hide all dashboards
      farmerDash.classList.add('hidden');
      farmerDash.style.display = 'none';
      deliveryDash.classList.add('hidden');
      deliveryDash.style.display = 'none';
      darkstoreDash.classList.add('hidden');
      darkstoreDash.style.display = 'none';
      adminDash.classList.add('hidden');
      adminDash.style.display = 'none';
      
      // Show customer view
      customerView.classList.remove('hidden');
      customerView.style.display = 'block';
      
      currentUser = null;
    }

    function logout() {
      currentUser = null;
      showCustomerView();
      showToast('Logged out');
    }

    // ============================================
    // ADMIN DASHBOARD FUNCTIONS
    // ============================================
    
    function showAdminDashboard() {
      // Hide all views
      document.getElementById('customer-view').classList.add('hidden');
      document.getElementById('customer-view').style.display = 'none';
      document.getElementById('farmer-dashboard').classList.add('hidden');
      document.getElementById('farmer-dashboard').style.display = 'none';
      document.getElementById('delivery-dashboard').classList.add('hidden');
      document.getElementById('delivery-dashboard').style.display = 'none';
      document.getElementById('darkstore-dashboard').classList.add('hidden');
      document.getElementById('darkstore-dashboard').style.display = 'none';
      
      // Show admin dashboard
      const adminDash = document.getElementById('admin-dashboard');
      adminDash.classList.remove('hidden');
      adminDash.style.display = 'block';
      
      // Render admin data
      renderAdminDashboard();
      setupAdminEventListeners();
      
      // Load site settings to form
      loadSiteSettingsToForm();
    }

    function renderAdminDashboard() {
      // Update stats
      document.getElementById('stat-products').textContent = products.length;
      document.getElementById('stat-orders').textContent = orders.length;
      document.getElementById('stat-users').textContent = users.length;
      
      const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
      document.getElementById('stat-revenue').textContent = `₹${totalRevenue.toLocaleString()}`;
      
      // Recent orders
      const recentOrders = document.getElementById('admin-recent-orders');
      const sortedOrders = [...orders].reverse().slice(0, 5);
      recentOrders.innerHTML = sortedOrders.length === 0 
        ? '<p class="text-gray-500 text-center py-4">No orders yet</p>'
        : sortedOrders.map(o => `
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div>
              <p class="font-medium text-gray-800">${o.order_id}</p>
              <p class="text-xs text-gray-500">${o.customer_name} • ₹${o.total}</p>
            </div>
            <span class="px-2 py-1 rounded-full text-xs font-medium ${o.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
              ${(o.status || 'pending').toUpperCase()}
            </span>
          </div>
        `).join('');
      
      // Pending products
      const pendingProducts = document.getElementById('admin-pending-products');
      const pending = products.filter(p => p.status === 'pending');
      pendingProducts.innerHTML = pending.length === 0
        ? '<p class="text-gray-500 text-center py-4">No pending products</p>'
        : pending.map(p => `
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div class="flex items-center gap-3">
              ${p.image && p.image.startsWith('http') 
                ? `<div class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                    <img src="${p.image}" alt="${p.product_name}" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<span class=\\'text-xl flex items-center justify-center h-full\\'>🥬</span>'">
                  </div>`
                : `<span class="text-2xl">${p.image || '🥬'}</span>`
              }
              <div>
                <p class="font-medium text-gray-800">${p.product_name}</p>
                <p class="text-xs text-gray-500">by ${p.farmer_name || 'Unknown'}</p>
              </div>
            </div>
            <div class="flex gap-2">
              <button onclick="approveProduct('${p.id}')" class="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition">✓ Approve</button>
              <button onclick="rejectProduct('${p.id}')" class="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition">✕ Reject</button>
            </div>
          </div>
        `).join('');
        
      renderAdminProductsList();
      renderAdminOrdersList();
      renderAdminUsersList();
    }

    function renderAdminProductsList() {
      const list = document.getElementById('admin-products-list');
      const allProducts = [...products].reverse();
      
      list.innerHTML = allProducts.length === 0
        ? '<p class="text-gray-500 text-center py-4">No products yet</p>'
        : allProducts.map(p => `
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer" onclick="openEditProductModal('${p.id}')">
            <div class="flex items-center gap-3">
              ${p.image && p.image.startsWith('http') 
                ? `<div class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                    <img src="${p.image}" alt="${p.product_name}" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<span class=\\'text-2xl flex items-center justify-center h-full\\'>🥬</span>'">
                  </div>`
                : `<span class="text-3xl">${p.image || '🥬'}</span>`
              }
              <div>
                <p class="font-medium text-gray-800">${p.product_name}</p>
                <p class="text-xs text-gray-500">${p.category} • ₹${p.price} ${p.original_price ? `<span class="line-through">₹${p.original_price}</span>` : ''} • ${p.quantity}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-1 rounded-full text-xs font-medium ${p.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : p.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}">
                ${(p.status || 'pending').toUpperCase()}
              </span>
              <button onclick="event.stopPropagation(); openEditProductModal('${p.id}')" class="px-2 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">✏️ Edit</button>
            </div>
          </div>
        `).join('');
    }
    
    function openEditProductModal(productId) {
      const product = products.find(p => p.id === productId);
      if (!product) return;
      
      editingProduct = product;
      
      document.getElementById('edit-product-id').value = product.id;
      document.getElementById('edit-product-name').value = product.product_name || '';
      document.getElementById('edit-product-price').value = product.price || '';
      document.getElementById('edit-product-original-price').value = product.original_price || '';
      document.getElementById('edit-product-category').value = product.category || 'vegetables';
      document.getElementById('edit-product-quantity').value = product.quantity || '';
      document.getElementById('edit-product-image').value = product.image || '';
      document.getElementById('edit-product-delivery').value = product.delivery_time || '8 MINS';
      document.getElementById('edit-product-description').value = product.description || '';
      document.getElementById('edit-product-status').value = product.status || 'approved';
      
      // Show image preview
      const previewImg = document.getElementById('edit-product-preview-img');
      if (product.image && (product.image.startsWith('http') || product.image.startsWith('data:'))) {
        previewImg.src = product.image;
      } else {
        // Show emoji or default
        previewImg.src = '';
        previewImg.alt = product.image || '🥬';
      }
      
      // Store current image in hidden field
      document.getElementById('edit-product-image').value = product.image || '';
      
      document.getElementById('edit-product-modal').classList.remove('hidden');
    }
    
    function closeEditProductModal() {
      document.getElementById('edit-product-modal').classList.add('hidden');
      editingProduct = null;
    }
    
    function saveProductEdit(e) {
      e.preventDefault();
      
      if (!editingProduct) return;
      
      const productId = document.getElementById('edit-product-id').value;
      const productIndex = products.findIndex(p => p.id === productId);
      
      if (productIndex === -1) return;
      
      // Update product in array
      products[productIndex] = {
        ...products[productIndex],
        product_name: document.getElementById('edit-product-name').value,
        price: parseFloat(document.getElementById('edit-product-price').value),
        original_price: parseFloat(document.getElementById('edit-product-original-price').value) || '',
        category: document.getElementById('edit-product-category').value,
        quantity: document.getElementById('edit-product-quantity').value,
        image: document.getElementById('edit-product-image').value || '🥬',
        delivery_time: document.getElementById('edit-product-delivery').value,
        description: document.getElementById('edit-product-description').value,
        status: document.getElementById('edit-product-status').value
      };
      
      // Also update in DEFAULT_PRODUCTS if it's a default product
      const defaultIndex = DEFAULT_PRODUCTS.findIndex(p => p.id === productId);
      if (defaultIndex !== -1) {
        DEFAULT_PRODUCTS[defaultIndex] = { ...products[productIndex] };
      }
      
      closeEditProductModal();
      showToast('Product updated! ⚡');
      renderAdminDashboard();
      renderProducts();
    }
    
    function deleteProduct() {
      if (!editingProduct) return;
      
      const productId = editingProduct.id;
      
      // Remove from products array
      products = products.filter(p => p.id !== productId);
      
      // Remove from DEFAULT_PRODUCTS if it's a default product
      const defaultIndex = DEFAULT_PRODUCTS.findIndex(p => p.id === productId);
      if (defaultIndex !== -1) {
        DEFAULT_PRODUCTS.splice(defaultIndex, 1);
      }
      
      closeEditProductModal();
      showToast('Product deleted! 🗑️');
      renderAdminDashboard();
      renderProducts();
    }

    function renderAdminOrdersList() {
      const list = document.getElementById('admin-orders-list');
      const allOrders = [...orders].reverse();
      
      list.innerHTML = allOrders.length === 0
        ? '<p class="text-gray-500 text-center py-4">No orders yet</p>'
        : allOrders.map(o => {
          const assignedPartner = users.find(u => u.id === o.delivery_partner);
          const isUnassigned = !o.delivery_partner || o.delivery_partner === '';
          const isPaymentPending = o.payment_status === 'pending_verification';
          const isUpiPayment = o.payment_method === 'upi';
          const isPaymentVerified = o.payment_status === 'verified';
          
          // Determine border color based on payment and order status
          let borderClass = 'border-gray-200';
          if (isPaymentPending) {
            borderClass = 'border-amber-400';
          } else if (o.status === 'delivered') {
            borderClass = 'border-emerald-200';
          } else if (isUnassigned) {
            borderClass = 'border-red-200';
          } else {
            borderClass = 'border-blue-200';
          }
          
          return `
          <div class="p-4 bg-gray-50 rounded-xl border-2 ${borderClass}">
            <div class="flex items-center justify-between mb-2">
              <div>
                <p class="font-bold text-gray-800">${o.order_id}</p>
                <p class="text-xs text-blue-600 font-mono">🎫 Delivery ID: ${o.delivery_id}</p>
                ${o.assignment_id ? `<p class="text-xs text-purple-600 font-mono">📋 Assignment ID: ${o.assignment_id}</p>` : ''}
              </div>
              <div class="flex flex-col items-end gap-1">
                <span class="px-3 py-1 rounded-full text-xs font-medium ${o.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : o.status === 'assigned' ? 'bg-blue-100 text-blue-700' : o.status === 'picked_up' ? 'bg-indigo-100 text-indigo-700' : o.status === 'payment_pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}">
                  ${(o.status || 'pending').toUpperCase().replace('_', ' ')}
                </span>
                ${isPaymentPending ? `<span class="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 animate-pulse">💳 PAYMENT PENDING</span>` : ''}
                ${isUnassigned && !isPaymentPending ? `<span class="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 animate-pulse">⚠️ UNASSIGNED</span>` : ''}
              </div>
            </div>
            
            <!-- Payment Info Section -->
            <div class="mb-3 p-3 rounded-lg ${isUpiPayment ? (isPaymentVerified ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200') : 'bg-blue-50 border border-blue-200'}">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium ${isUpiPayment ? (isPaymentVerified ? 'text-emerald-700' : 'text-amber-700') : 'text-blue-700'}">
                    ${isUpiPayment ? '📱 UPI Payment' : '💵 Cash on Delivery'}
                  </p>
                  ${isUpiPayment && o.utr_number ? `
                    <p class="text-xs text-gray-600 mt-1">UTR: <span class="font-mono font-bold">${o.utr_number}</span></p>
                  ` : ''}
                </div>
                <div class="flex items-center gap-2">
                  ${isPaymentPending ? `
                    <button onclick="verifyPayment('${o.id}')" class="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1 pulse-btn">
                      ✅ Verify Payment
                    </button>
                    <button onclick="rejectPayment('${o.id}')" class="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition">
                      ❌ Reject
                    </button>
                  ` : isPaymentVerified ? `
                    <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">✅ VERIFIED</span>
                  ` : isUpiPayment ? `
                    <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Pending</span>
                  ` : `
                    <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">COD</span>
                  `}
                </div>
              </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
              <p>👤 ${o.customer_name}</p>
              <p>📞 ${o.phone}</p>
              <p>📍 ${o.address}</p>
              <p>💰 ₹${o.total}</p>
            </div>
            ${assignedPartner ? `
              <div class="mt-2 p-2 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-700">🚴 Assigned to: <strong>${assignedPartner.name}</strong> (${assignedPartner.email || ''})</p>
              </div>
            ` : isPaymentPending ? `
              <div class="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                <p class="text-sm text-amber-700">⚠️ Verify payment before assigning delivery partner</p>
              </div>
            ` : `
              <div class="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
                <p class="text-sm text-red-700">⚠️ No delivery partner assigned yet</p>
              </div>
            `}
            <div class="flex gap-2 mt-3 flex-wrap">
              ${!isPaymentPending ? (isUnassigned ? `
                <button onclick="openAssignOrderModal('${o.id}')" class="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700 transition pulse-btn flex items-center gap-2">
                  🚴 Assign Delivery Partner
                </button>
              ` : `
                <button onclick="openAssignOrderModal('${o.id}')" class="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition">🔄 Reassign Partner</button>
              `) : ''}
              ${o.status !== 'delivered' && !isPaymentPending ? `
                <button onclick="adminUpdateOrderStatus('${o.id}', 'processing')" class="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition">Processing</button>
                <button onclick="adminUpdateOrderStatus('${o.id}', 'delivered')" class="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition">Delivered</button>
              ` : o.status === 'delivered' ? '<span class="text-emerald-600 font-medium text-sm flex items-center gap-1">✅ Order Completed</span>' : ''}
            </div>
          </div>
        `}).join('');
    }
    
    // Verify Payment Function
    async function verifyPayment(orderId) {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;
      
      order.payment_status = 'verified';
      order.status = 'pending';
      order.tracking = 'Payment verified - Awaiting delivery assignment';
      order.verified_at = new Date().toISOString();
      
      await updateRecord('Orders', order);
      showToast('Payment verified! ✅ You can now assign a delivery partner');
      renderAdminDashboard();
    }
    
    // Reject Payment Function
    async function rejectPayment(orderId) {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;
      
      order.payment_status = 'rejected';
      order.status = 'payment_failed';
      order.tracking = 'Payment verification failed - Please contact customer';
      
      await updateRecord('Orders', order);
      showToast('Payment rejected ❌');
      renderAdminDashboard();
    }

    function renderAdminUsersList() {
      const list = document.getElementById('admin-users-list');
      
      list.innerHTML = users.length === 0
        ? '<p class="text-gray-500 text-center py-4">No users yet</p>'
        : users.map(u => `
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <span class="text-lg">${u.user_type === 'farmer' ? '🌾' : u.user_type === 'delivery' ? '��' : u.user_type === 'darkstore' ? '🏪' : '👤'}</span>
              </div>
              <div>
                <p class="font-medium text-gray-800">${u.name}</p>
                <p class="text-xs text-gray-500">${u.email} • ${u.phone || 'No phone'}</p>
              </div>
            </div>
            <span class="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium uppercase">${u.user_type}</span>
          </div>
        `).join('');
    }

    // ============================================
    // ORDER ASSIGNMENT FUNCTIONS
    // ============================================
    
    let assigningOrderId = null;
    
    function openAssignOrderModal(orderId) {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;
      
      assigningOrderId = orderId;
      
      // Populate order info
      const orderInfo = document.getElementById('assign-order-info');
      orderInfo.innerHTML = `
        <p class="font-bold text-gray-800 mb-1">${order.order_id}</p>
        <p class="text-sm text-gray-600">��� ${order.customer_name}</p>
        <p class="text-sm text-gray-600">📍 ${order.address}</p>
        <p class="text-sm text-emerald-600 font-bold">���${order.total}</p>
      `;
      
      // Populate delivery partners dropdown
      const select = document.getElementById('select-delivery-partner');
      const deliveryPartners = users.filter(u => u.user_type === 'delivery');
      select.innerHTML = '<option value="">-- Choose Partner --</option>' + 
        deliveryPartners.map(p => `<option value="${p.id}">${p.name} (${p.email})</option>`).join('');
      
      // Generate new assignment ID
      const newAssignmentId = generateId('ASN');
      document.getElementById('new-assignment-id').textContent = newAssignmentId;
      document.getElementById('assignment-id-preview').classList.remove('hidden');
      
      document.getElementById('assign-order-modal').classList.remove('hidden');
    }
    
    function closeAssignOrderModal() {
      document.getElementById('assign-order-modal').classList.add('hidden');
      assigningOrderId = null;
    }
    
    async function confirmAssignOrder() {
      const partnerId = document.getElementById('select-delivery-partner').value;
      if (!partnerId) {
        showToast('Please select a delivery partner', 'warning');
        return;
      }
      
      const order = orders.find(o => o.id === assigningOrderId);
      if (!order) return;
      
      const assignmentId = document.getElementById('new-assignment-id').textContent;
      
      // Update order with assignment
      order.delivery_partner = partnerId;
      order.assignment_id = assignmentId;
      order.status = 'assigned';
      order.assigned_at = new Date().toISOString();
      
      await updateRecord('Orders', order);
      
      const partner = users.find(u => u.id === partnerId);
      showToast(`Order assigned to ${partner?.name || 'partner'}! 🚴`);
      
      closeAssignOrderModal();
      renderAdminDashboard();
    }

    async function approveProduct(productId) {
      const product = products.find(p => p.id === productId);
      if (product) {
        product.status = 'approved';
        await updateRecord('Products', product);
        showToast('Product approved! ⚡');
        renderAdminDashboard();
        renderProducts();
      }
    }

    async function rejectProduct(productId) {
      const product = products.find(p => p.id === productId);
      if (product) {
        product.status = 'rejected';
        await updateRecord('Products', product);
        showToast('Product rejected');
        renderAdminDashboard();
      }
    }

    async function adminUpdateOrderStatus(orderId, status) {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        order.status = status;
        await updateRecord('Orders', order);
        showToast('Order updated! ⚡');
        renderAdminDashboard();
      }
    }

    function setupAdminEventListeners() {
      // Only setup once
      if (window.adminListenersSet) return;
      window.adminListenersSet = true;
      
      // Admin logout
      document.getElementById('admin-logout').addEventListener('click', logout);
      
      // Hero settings form
      document.getElementById('hero-settings-form').addEventListener('submit', (e) => {
        e.preventDefault();
        siteSettings.hero = {
          title: document.getElementById('hero-title').value || siteSettings.hero.title,
          subtitle: document.getElementById('hero-subtitle').value || siteSettings.hero.subtitle,
          badge: document.getElementById('hero-badge').value || siteSettings.hero.badge,
          tag: document.getElementById('hero-tag').value || siteSettings.hero.tag,
          emoji: document.getElementById('hero-emoji').value || siteSettings.hero.emoji,
          bgImage: document.getElementById('hero-bg-image-data').value || '',
          gradientFrom: document.getElementById('hero-gradient-from').value || '#10b981',
          gradientTo: document.getElementById('hero-gradient-to').value || '#14b8a6'
        };
        applyHeroSettings();
        showToast('Hero banner updated! 🖼️');
      });
      
      // About settings form
      document.getElementById('about-settings-form').addEventListener('submit', (e) => {
        e.preventDefault();
        siteSettings.about = {
          enabled: document.getElementById('about-enabled').checked,
          title: document.getElementById('about-title').value || siteSettings.about.title,
          description: document.getElementById('about-description').value || siteSettings.about.description,
          image: document.getElementById('about-image-data').value || '',
          missionTitle: document.getElementById('about-mission-title').value || siteSettings.about.missionTitle,
          missionText: document.getElementById('about-mission-text').value || siteSettings.about.missionText,
          visionTitle: document.getElementById('about-vision-title').value || siteSettings.about.visionTitle,
          visionText: document.getElementById('about-vision-text').value || siteSettings.about.visionText
        };
        applyAboutSettings();
        showToast('About section updated! 📝');
      });
      
      // Live preview for hero settings
      ['hero-title', 'hero-subtitle', 'hero-badge', 'hero-emoji'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateHeroPreview);
      });
      
      // Sync color inputs
      document.getElementById('hero-gradient-from').addEventListener('input', (e) => {
        document.getElementById('hero-gradient-from-text').value = e.target.value;
        updateHeroPreview();
      });
      document.getElementById('hero-gradient-from-text').addEventListener('input', (e) => {
        if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
          document.getElementById('hero-gradient-from').value = e.target.value;
          updateHeroPreview();
        }
      });
      document.getElementById('hero-gradient-to').addEventListener('input', (e) => {
        document.getElementById('hero-gradient-to-text').value = e.target.value;
        updateHeroPreview();
      });
      document.getElementById('hero-gradient-to-text').addEventListener('input', (e) => {
        if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
          document.getElementById('hero-gradient-to').value = e.target.value;
          updateHeroPreview();
        }
      });
      
      // Admin tabs
      document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('.admin-tab').forEach(t => {
            t.classList.remove('bg-emerald-600', 'text-white');
            t.classList.add('hover:bg-gray-200', 'text-gray-600');
          });
          tab.classList.add('bg-emerald-600', 'text-white');
          tab.classList.remove('hover:bg-gray-200', 'text-gray-600');
          
          document.querySelectorAll('.admin-panel').forEach(p => p.classList.add('hidden'));
          document.getElementById(`admin-${tab.dataset.tab}`).classList.remove('hidden');
        });
      });
      
      // Edit product form
      document.getElementById('edit-product-form').addEventListener('submit', saveProductEdit);
      
      // Admin add product form
      document.getElementById('admin-add-product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const productData = {
          id: generateId('PRD'),
          product_name: document.getElementById('admin-product-name').value,
          price: parseFloat(document.getElementById('admin-product-price').value),
          category: document.getElementById('admin-product-category').value,
          quantity: document.getElementById('admin-product-quantity').value,
          image: document.getElementById('admin-product-image-data').value || '🥬',
          delivery_time: document.getElementById('admin-product-delivery').value,
          status: 'approved',
          farmer_id: 'ADMIN',
          farmer_name: 'Admin',
          created_at: new Date().toISOString()
        };
        
        await createRecord('Products', productData);
        products.push(productData);
        showToast('Product added! ⚡');
        e.target.reset();
        document.getElementById('admin-product-image-data').value = '';
        document.getElementById('admin-image-preview').classList.add('hidden');
        renderAdminDashboard();
        renderProducts();
      });
      
      // Refresh buttons
      document.getElementById('admin-refresh-products').addEventListener('click', async () => {
        products = await fetchFromSheet('Products');
        renderAdminDashboard();
        showToast('Products refreshed!');
      });
      
      document.getElementById('admin-refresh-orders').addEventListener('click', async () => {
        orders = await fetchFromSheet('Orders');
        renderAdminDashboard();
        showToast('Orders refreshed!');
      });
      
      document.getElementById('admin-refresh-users').addEventListener('click', async () => {
        users = await fetchFromSheet('Users');
        renderAdminDashboard();
        showToast('Users refreshed!');
      });
    }

    // ============================================
    // ELEMENT SDK INITIALIZATION
    // ============================================
    
    const elementHandler = {
      defaultConfig,
      async onConfigChange(config) {
        const title = config.site_title || defaultConfig.site_title;
        const heroText = config.hero_text || defaultConfig.hero_text;
        document.title = title;
        const siteTitleEl = document.getElementById('site-title');
        if (siteTitleEl) siteTitleEl.textContent = title;
        const heroEl = document.getElementById('hero-text');
        if (heroEl) heroEl.textContent = heroText;
      },
      mapToCapabilities(config) {
        return {
          recolorables: [],
          borderables: [],
          fontEditable: undefined,
          fontSizeable: undefined
        };
      },
      mapToEditPanelValues(config) {
        return new Map([
          ['site_title', config.site_title || defaultConfig.site_title],
          ['hero_text', config.hero_text || defaultConfig.hero_text]
        ]);
      }
    };

    // ============================================
    // APP INITIALIZATION
    // ============================================
    
    async function init() {
      // Initialize Element SDK
      if (window.elementSdk) {
        window.elementSdk.init(elementHandler);
      }
      
      // Load data from Google Sheets
      const success = await loadAllData();
      
      if (!success || products.length === 0) {
        // Try fetching just products
        products = await fetchFromSheet('Products');
        products = products.filter(p => p.product_name);
      }
      
      // Setup event listeners
      setupEventListeners();
      
      // Render products
      renderProducts();
      
      // Hide loading, show app
      setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('customer-view').classList.remove('hidden');
      }, 500);
    }

    // Start the app
    init();
