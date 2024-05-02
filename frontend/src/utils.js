export function openSidebar() {
  if (typeof window !== 'undefined') {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.setProperty('--SideNavigation-slideIn', '1');
  }
}

export function closeSidebar() {
  if (typeof window !== 'undefined') {
    document.documentElement.style.removeProperty('--SideNavigation-slideIn');
    document.body.style.removeProperty('overflow');
  }
}

export function toggleSidebar() {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const slideIn = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--SideNavigation-slideIn');
    if (slideIn) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
}

export function openMessagesPane() {
  if (typeof window !== 'undefined') {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.setProperty('--MessagesPane-slideIn', '1');
  }
}

export function closeMessagesPane() {
  if (typeof window !== 'undefined') {
    document.documentElement.style.removeProperty('--MessagesPane-slideIn');
    document.body.style.removeProperty('overflow');
  }
}

export function toggleMessagesPane() {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const slideIn = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--MessagesPane-slideIn');
    if (slideIn) {
      closeMessagesPane();
    } else {
      openMessagesPane();
    }
  }
}


export function timestampToNiceText(timestamp) {
  const now = new Date();
  const targetDate = new Date(timestamp);

  // Check if the target date is today
  if (targetDate.toDateString() === now.toDateString()) {
    return targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Check if the target date is within the last week
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (targetDate > oneWeekAgo) {
    return targetDate.toLocaleDateString('en-US', { weekday: 'long', hour: '2-digit', minute: '2-digit' });
  }

  // Check if the target date is within the current year
  if (targetDate.getFullYear() === now.getFullYear()) {
    return targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  // Default case: show full date and time
  return targetDate.toLocaleString();
}

export function formatMessageText(text)  {
  const lines = text.split('\n');
  const jsxElements = [];
  let inCodeBlock = false;

  lines.forEach(line => {
      if (line.startsWith('```')) {
          inCodeBlock = !inCodeBlock;
          if (!inCodeBlock) {
              jsxElements.push(<code>{line.slice(3)}</code>);
          }
      } else if (inCodeBlock) {
          jsxElements.push(line);
      } else if (line.startsWith('**')) {
          jsxElements.push(<strong>{line.slice(2)}</strong>);
      } else if (line.startsWith('*')) {
          jsxElements.push(<li>{line.slice(1)}</li>);
      } else {
          jsxElements.push(<p>{line}</p>);
      }
  });

  return jsxElements;
}