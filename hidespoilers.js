function hidePosts() {
  browser.storage.sync.get('blockedWords', function(data) {
    const blockedWords = data.blockedWords || [];
    const postTexts = document.querySelectorAll('[data-ad-comet-preview="message"]');

    postTexts.forEach(function(postText) {
      const postContent = postText.textContent.toLowerCase();

      for (const blockedWord of blockedWords) {
        if (postContent.includes(blockedWord.toLowerCase())) {
          const postContainer = getPostContainer(postText);

          if (postContainer && !postContainer.classList.contains('spoiler-showed')) {
            addSpoilerBlur(postContainer, blockedWord);
          }

          break;
        }
      }
    });
  });
}
  
function getPostContainer(postText) {
    let postContainer = postText.parentNode;
  
    for (let i = 1; i <= 4 && postContainer; i++) {
      postContainer = postContainer.parentNode;
    }
  
    return postContainer;
}
  
function addSpoilerBlur(postContainer, blockedWord) {
    postContainer.classList.add('spoiler-blurred');
    postContainer.style.filter = 'blur(30px)';
    postContainer.style.pointerEvents = 'none';
  
    const spoilerBlurredDivs = document.querySelectorAll('.spoiler-blurred');
  
    spoilerBlurredDivs.forEach(function(div) {
      const postContainerParent = div.parentNode;
      const existingButton = postContainerParent.querySelector('.spoiler-show-button');
  
      if (!existingButton) {
        const button = createSpoilerButton(div);
        const warningLabel = createWarningLabel(blockedWord);
  
        postContainerParent.appendChild(warningLabel);
        postContainerParent.appendChild(button);
      }
    });
}
  
function createSpoilerButton(div) {
    const button = document.createElement('button');
  
    button.classList.add('spoiler-show-button');
    button.innerHTML = '<strong>Show me</strong>';
  
    button.addEventListener('click', function() {
      div.classList.remove('spoiler-blurred');
      div.classList.add('spoiler-showed');
      div.style.filter = 'none';
      div.style.pointerEvents = 'auto';
      button.style.display = 'none';

      const warningLabel = div.parentNode.querySelector('.warning-label');
      if (warningLabel) {
        warningLabel.remove();
      }
    });
  
    return button;
}
  
function createWarningLabel(blockedWord) {
    const warningLabel = document.createElement('div');
    const warningText = document.createTextNode(`Warning: This post contains the word '${blockedWord}'. Are you sure you want to view it?`);
  
    warningLabel.classList.add('warning-label');
    warningLabel.appendChild(warningText);
  
    return warningLabel;
}
  
window.onload = function() {
  hidePosts();
};
  
window.addEventListener('scroll', function() {
  hidePosts();
});
  