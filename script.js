document.addEventListener("DOMContentLoaded", () => {
   
    const quoteContainer = document.getElementById("quote-container")
    const quoteCard = document.getElementById("quote-card")
    const quoteText = document.getElementById("quote")
    const authorText = document.getElementById("author")
    const newQuoteBtn = document.getElementById("new-quote")
    const copyBtn = document.getElementById("copy")
    const tweetBtn = document.getElementById("tweet")
    const exportBtn = document.getElementById("export")
    const loading = document.getElementById("loading")
    const quoteContent = document.getElementById("quote-content")
    const toast = document.getElementById("toast")
    const toastMessage = document.getElementById("toast-message")
  
    
    let currentQuote = ""
    let currentAuthor = ""
  
    
    function showLoading() {
      loading.classList.remove("hidden")
      quoteContent.classList.add("hidden")
    }
  
   
    function hideLoading() {
      loading.classList.add("hidden")
      quoteContent.classList.remove("hidden")
    }
  
    
    function showToast(message, duration = 3000) {
      toastMessage.textContent = message
      toast.classList.remove("hidden")
      toast.classList.add("show")
  
      setTimeout(() => {
        toast.classList.remove("show")
        setTimeout(() => {
          toast.classList.add("hidden")
        }, 300)
      }, duration)
    }
  
    
    async function setRandomBackground() {
      try {
        const timestamp = new Date().getTime()
        const imageUrl = `https://source.unsplash.com/random/1920x1080/?nature,landscape&t=${timestamp}`
  
        
        const img = new Image()
        img.onload = () => {
          document.body.style.backgroundImage = `url(${imageUrl})`
        }
        img.src = imageUrl
      } catch (error) {
        console.error("Failed to fetch background image:", error)
      }
    }
  
  
    async function getQuote() {
      showLoading()
  
      try {
        const apiUrl = "https://api.freeapi.app/api/v1/public/quotes/quote/random"
        const response = await fetch(apiUrl)
        const data = await response.json()
  
        if (data.success && data.data) {
          
          currentQuote = data.data.content
          currentAuthor = data.data.author
  
          
          quoteText.textContent = currentQuote
          authorText.textContent = currentAuthor
          hideLoading()
        } else {
          throw new Error("Failed to fetch quote")
        }
      } catch (error) {
        console.error("Error fetching quote:", error)
        quoteText.textContent = "An error occurred while fetching the quote. Please try again."
        authorText.textContent = ""
        hideLoading()
      }
    }
  
   
    function copyQuote() {
        const textToCopy = `${currentQuote} - ${currentAuthor}`;

  
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          showToast("Quote copied to clipboard!")
        })
        .catch(() => {
          showToast("Failed to copy. Please try again.")
        })
    }
  
   
    function tweetQuote() {
        const tweetText = encodeURIComponent(`${currentQuote} - ${currentAuthor}`);

      const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`
      window.open(twitterUrl, "_blank")
    }
  

    async function exportQuote() {
      try {
   
        if (typeof html2canvas === "undefined") {
          showToast("html2canvas is not available. Please ensure it is properly loaded.")
          return
        }
  
        const canvas = await html2canvas(quoteCard, {
          backgroundColor: null,
          useCORS: true,
          scale: 2, 
        })
  
        const image = canvas.toDataURL("image/png")
        const link = document.createElement("a")
        link.href = image
        link.download = `quote-${new Date().getTime()}.png`
        link.click()
  
        showToast("Quote image saved to your device!")
      } catch (error) {
        console.error("Error exporting quote:", error)
        showToast("Failed to export image. Please try again.")
      }
    }
  
    
    newQuoteBtn.addEventListener("click", getQuote)
    copyBtn.addEventListener("click", copyQuote)
    tweetBtn.addEventListener("click", tweetQuote)
    exportBtn.addEventListener("click", exportQuote)
  
    
    setRandomBackground()
    getQuote()
  })
  
  