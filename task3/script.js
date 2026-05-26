// Gather Element Hooks
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const closeBtn = document.querySelector('.close-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

// State Trackers
let visibleItems = [...galleryItems]; // Tracks items currently seen post-filter
let currentIndex = 0;

/* --- Category Filtering Logic --- */
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Handle Active Button Styles
        document.querySelector('.filter-btn.active').classList.remove('active');
        button.classList.add('active');

        const activeFilter = button.getAttribute('data-filter');

        // Apply Hide Classes depending on category selections
        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (activeFilter === 'all' || itemCategory === activeFilter) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });

        // RE-COMPILE array tracking ONLY elements visible on user screen
        visibleItems = galleryItems.filter(item => !item.classList.contains('hidden'));
    });
});

/* --- Lightbox Rendering Framework --- */
function updateLightbox(index) {
    if (index < 0 || index >= visibleItems.length) return;
    
    const currentCard = visibleItems[index];
    const imageSource = currentCard.querySelector('img').src;
    const imageAltText = currentCard.querySelector('img').alt;
    const captionContent = currentCard.querySelector('.caption').textContent;

    // Apply values directly into view injection points
    lightboxImg.src = imageSource;
    lightboxImg.alt = imageAltText;
    lightboxCaption.textContent = captionContent;
    currentIndex = index;
}

// Attach Open Triggers to grid card clicks
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        // Trace current position index matching ONLY the visible pool
        const targetIndex = visibleItems.indexOf(item);
        if (targetIndex !== -1) {
            updateLightbox(targetIndex);
            lightbox.classList.add('active');
        }
    });
});

// Navigation Functions
const loadNextImage = () => {
    let nextIdx = currentIndex + 1;
    if (nextIdx >= visibleItems.length) nextIdx = 0; // loops back cleanly
    updateLightbox(nextIdx);
};

const loadPrevImage = () => {
    let prevIdx = currentIndex - 1;
    if (prevIdx < 0) prevIdx = visibleItems.length - 1; // loop back to end 
    updateLightbox(prevIdx);
};

// Event Listeners for Nav controls
nextBtn.addEventListener('click', (e) => { e.stopPropagation(); loadNextImage(); });
prevBtn.addEventListener('click', (e) => { e.stopPropagation(); loadPrevImage(); });

// Lightbox Dismissal Controllers
const closeLightboxView = () => lightbox.classList.remove('active');
closeBtn.addEventListener('click', closeLightboxView);

// Click out of image zone to close modal cleanly
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightboxView();
});

// Hardware Accessibility Keyboard Shortcuts Map
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightboxView();
    if (e.key === 'ArrowRight') loadNextImage();
    if (e.key === 'ArrowLeft') loadPrevImage();
});
