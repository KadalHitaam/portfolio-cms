export async function getLearningNotes() {
  const databaseId = import.meta.env.NOTION_DATABASE_ID;
  const token = import.meta.env.NOTION_TOKEN;

  if (!databaseId || !token) {
    console.warn('⚠️ Notion credentials (NOTION_DATABASE_ID or NOTION_TOKEN) are missing in .env');
    return [];
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        sorts: [{ property: 'Tanggal', direction: 'descending' }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Notion API Error [${response.status}]:`, errorText);
      return [];
    }

    const data = await response.json();

    const notesWithContent = await Promise.all(
      data.results.map(async (page) => {
        const props = page.properties;
        let contentHtml = '';

        try {
          const blocksRes = await fetch(`https://api.notion.com/v1/blocks/${page.id}/children`, { headers });
          if (blocksRes.ok) {
            const blocksData = await blocksRes.json();
            contentHtml = parseNotionBlocksToHtml(blocksData.results);
          }
        } catch (e) {
          console.error('Error fetching blocks for page:', page.id, e);
        }

        return {
          id: page.id,
          title: props.Name?.title?.[0]?.plain_text || 'Untitled',
          category: props.Kategori?.select?.name || 'Uncategorized',
          level: props.Tingkat?.select?.name || 'Beginner',
          date: props.Tanggal?.date?.start || page.created_time.split('T')[0],
          content: contentHtml || '<p class="text-gray-500 italic">Tidak ada isi catatan.</p>',
        };
      })
    );

    return notesWithContent;
  } catch (error) {
    console.error('❌ Fetch Execution Error:', error);
    return [];
  }
}

function parseNotionBlocksToHtml(blocks) {
  return blocks.map((block) => {
    const type = block.type;
    const value = block[type];
    const text = value?.rich_text?.map((t) => t.plain_text).join('') || '';

    switch (type) {
      case 'heading_1':
        return `<h1 class="text-2xl font-bold text-white mt-6 mb-3">${escapeHtml(text)}</h1>`;
      case 'heading_2':
        return `<h2 class="text-xl font-semibold text-white mt-5 mb-2">${escapeHtml(text)}</h2>`;
      case 'heading_3':
        return `<h3 class="text-lg font-medium text-white mt-4 mb-2">${escapeHtml(text)}</h3>`;
      case 'bulleted_list_item':
        return `<li class="list-disc ml-5 text-gray-300 my-1">${escapeHtml(text)}</li>`;
      case 'numbered_list_item':
        return `<li class="list-decimal ml-5 text-gray-300 my-1">${escapeHtml(text)}</li>`;
      case 'code':
        return `<pre class="bg-zinc-900 border border-zinc-800 p-4 rounded-lg overflow-x-auto my-4 text-emerald-400 font-mono text-sm"><code>${escapeHtml(text)}</code></pre>`;
      case 'quote':
        return `<blockquote class="border-l-4 border-emerald-500 pl-4 italic text-gray-400 my-3">${escapeHtml(text)}</blockquote>`;
      case 'paragraph':
      default:
        return text ? `<p class="mb-3 text-gray-300 leading-relaxed">${escapeHtml(text)}</p>` : '';
    }
  }).join('');
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
