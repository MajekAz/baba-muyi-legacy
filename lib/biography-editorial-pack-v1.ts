import type { CmsContentRecord, CmsPage } from "@/lib/cms-types";

const defaultWorkspaceId = "workspace-baba-muyi-family-archive";
const defaultLegacyProfileId = "legacy-profile-baba-muyi";

const implementedAt = "2026-07-30T00:00:00.000Z";

export const biographyEditorialPage: Partial<CmsPage> & { id: string; path: string } = {
  id: "page-biography",
  path: "/biography",
  eyebrow: "Museum Biography",
  title: "The Biography of Alhaji Tioluwalase “Baba Muyi” Majekodunmi",
  description:
    "The official biography of Alhaji Tioluwalase “Baba Muyi” Majekodunmi—a transport entrepreneur, family patriarch, community figure, high chief, and humanitarian remembered for his generosity, enterprise, and service to others.",
  body: "Approved for publication as BIOGRAPHY_EDITORIAL_PACK_v1.0.",
  cards: [
    {
      id: "biography-related-timeline",
      title: "Timeline",
      description: "Explore approved chronology records connected to Baba Muyi’s life.",
      href: "/timeline"
    },
    {
      id: "biography-related-gallery",
      title: "Gallery",
      description: "View published photographs and archive media when available.",
      href: "/gallery"
    },
    {
      id: "biography-related-documentary",
      title: "Documentary",
      description: "Watch approved documentary material connected to the archive.",
      href: "/documentaries"
    },
    {
      id: "biography-related-lessons",
      title: "Legacy Lessons",
      description: "Read values and lessons preserved from Baba Muyi’s story.",
      href: "/lessons"
    },
    {
      id: "biography-related-tributes",
      title: "Memorial Wall",
      description: "Read or share reviewed public memories and tributes.",
      href: "/tributes"
    }
  ],
  seoTitle: "Alhaji Tioluwalase “Baba Muyi” Majekodunmi | Official Biography",
  metaDescription:
    "Explore the life, entrepreneurial journey, family values, community service, and enduring legacy of Alhaji Tioluwalase “Baba Muyi” Majekodunmi, preserved by the LegacyHub Digital Museum.",
  verificationStatus: "family_memory",
  updatedAt: implementedAt
};

export const biographyEditorialSourceNote = [
  "Editorial version: BIOGRAPHY_EDITORIAL_PACK_v1.0",
  "Publication status: Approved",
  "Collection: Baba Muyi Family and Community History Collection",
  "Content type: Museum Biography",
  "Language: English",
  "Editorial attribution: Written and documented by Azeez Adeyemi Majekodunmi, the sixteenth child of Baba Muyi.",
  "Last editorial review date: 2026-07-30",
  "Verification status: Partially verified / oral-history based",
  "Source note: Prepared from the personal recollections of Azeez Adeyemi Majekodunmi, existing family writings, documentary materials, photographs, and the Baba Muyi family oral-history collection."
].join("\n");

export const biographyEditorialChapter: CmsContentRecord = {
  id: "biography-editorial-pack-v1",
  workspaceId: defaultWorkspaceId,
  legacyProfileId: defaultLegacyProfileId,
  kind: "biography_chapter",
  title: "Alhaji Tioluwalase “Baba Muyi” Majekodunmi",
  slug: "official-biography",
  summary:
    "The official biography of Alhaji Tioluwalase “Baba Muyi” Majekodunmi—a transport entrepreneur, family patriarch, community figure, high chief, and humanitarian remembered for his generosity, enterprise, and service to others.",
  body: `
<p>Alhaji Tioluwalase Majekodunmi, popularly known as “Baba Muyi,” was an entrepreneur, transport operator, family patriarch, community figure, high chief, and humanitarian whose life became closely connected with the social and commercial history of Bariga, Lagos.</p>
<p>To many people, he was known simply as Alhaji or Baba Muyi. The name “Baba Muyi” came from his first child, Muyi, in accordance with the familiar Yoruba custom of respectfully identifying a parent through the name of their child.</p>
<p>To his children, however, he was much more than a public name. He was their father, provider, adviser, disciplinarian, protector, and the central figure of a large and complex family.</p>
<p>His life was defined by enterprise, generosity, responsibility, service, family loyalty, personal sacrifice, and a deep desire to help others progress.</p>

<h2>Early Life and Family Roots</h2>
<p>Baba Muyi was born in Abeokuta, in present-day Ogun State, Nigeria.</p>
<p>His family roots were also closely connected to Iboogun, the village where his parents lived and where they were eventually buried.</p>
<p>During his younger years, he moved between Abeokuta and Iboogun before beginning a new chapter of his life in Lagos.</p>
<p>His upbringing was shaped by Yoruba family values, respect for elders, communal responsibility, hard work, oral tradition, and the belief that a person’s success should also benefit the people around them.</p>
<p>These values remained visible throughout his adult life.</p>

<h2>His Journey to Bariga</h2>
<p>As a young man, Baba Muyi left Iboogun and moved to Bariga, Lagos.</p>
<p>At the time of his arrival, parts of Bariga were still developing and were very different from the densely populated urban community known today.</p>
<p>The area contained undeveloped land, narrow roads, footpaths, and sections that were still surrounded by vegetation.</p>
<p>Moving to Bariga required courage, adaptability, and a willingness to build a future in a changing environment.</p>
<p>Baba Muyi became part of the generation whose work, businesses, homes, and community relationships contributed to the development of the area.</p>
<p>Bariga later became central to his family life, business activities, public identity, and historical legacy.</p>

<h2>Becoming an Entrepreneur</h2>
<p>Baba Muyi became an entrepreneur at a relatively young age.</p>
<p>He ventured into transportation during an important period in the development of public transport in Lagos.</p>
<p>His early involvement was associated with the wooden passenger vehicles popularly known as Bolekaja.</p>
<p>The name “Bolekaja,” often interpreted as “come down and let us fight,” reflected the lively and sometimes confrontational atmosphere associated with early commercial passenger transport.</p>
<p>These vehicles played an important role in moving workers, traders, families, and other passengers through Lagos before more modern forms of public transportation became widely available.</p>
<p>Baba Muyi recognised transportation as both a business opportunity and a necessary public service.</p>

<h2>From Bolekaja to Molue</h2>
<p>As Lagos developed, its transportation system also changed.</p>
<p>The earlier wooden Bolekaja vehicles were gradually followed by larger buses, including the Molue buses that became an important symbol of public transportation in Lagos during the 1960s, 1970s, and later periods.</p>
<p>Baba Muyi successfully moved with this development.</p>
<p>His transport vehicles carried the inscription:</p>
<blockquote><p><strong>TIOLUWA LASE</strong></p></blockquote>
<p>The name became associated with his business and identity.</p>
<p>His buses operated along routes connecting communities and commercial centres, including Bariga, Yaba, Oyingbo, Eko-Idumota, and surrounding areas.</p>
<p>His transport business was not only a personal source of income. It also created work for drivers, conductors, mechanics, assistants, and other people whose families depended upon the enterprise.</p>
<p>Through transportation, Baba Muyi helped people travel to work, markets, schools, businesses, family homes, and other destinations across Lagos.</p>

<h2>Building People Through Business</h2>
<p>One of the defining qualities of Baba Muyi’s entrepreneurship was his belief that success should not benefit only one person.</p>
<p>His business created opportunities for others.</p>
<p>Workers earned livelihoods through his vehicles.</p>
<p>Relatives received assistance.</p>
<p>People seeking employment or economic support often came to him.</p>
<p>He also assisted some of his siblings by giving them opportunities to participate in transportation and establish livelihoods of their own.</p>
<p>This reflected a principle that remained central to his life: a successful person should help other people rise.</p>
<p>He was not interested only in building vehicles, businesses, houses, or properties.</p>
<p>He was also interested in building people.</p>

<h2>The Family Patriarch</h2>
<p>Baba Muyi was the father of twenty-seven children and led a large family household.</p>
<p>Managing such a family required considerable responsibility.</p>
<p>He had to balance the needs of his wives, children, relatives, workers, visitors, business associates, and members of the wider community.</p>
<p>His family home was frequently active.</p>
<p>Children, relatives, friends, employees, neighbours, and visitors moved through the household.</p>
<p>People came to speak with him, seek assistance, receive advice, discuss business matters, or spend time in his company.</p>
<p>His responsibilities therefore extended well beyond ordinary parenting.</p>
<p>He became the central figure in a broad network of family and community relationships.</p>

<h2>Why People Called Him Baba Muyi</h2>
<p>Muyi was Baba Muyi’s first child.</p>
<p>Through Yoruba naming custom, people began referring to him as Baba Muyi—meaning Muyi’s father.</p>
<p>The name became so widely recognised that many people knew him primarily through it.</p>
<p>Depending on their relationship with him, some called him Alhaji, some called him Baba Muyi, and others addressed him by his traditional or community title.</p>
<p>Each name reflected a different part of his identity:</p>
<ul>
<li>“Alhaji” reflected his Islamic religious status.</li>
<li>“Baba Muyi” reflected his role as a father and family patriarch.</li>
<li>His chieftaincy title reflected his position and recognition within the community.</li>
<li>“Tioluwalase” reflected his personal identity and transport enterprise.</li>
</ul>
<p>Together, these names reveal the many roles he carried during his lifetime.</p>

<h2>A High Chief and Community Figure</h2>
<p>Baba Muyi was recognised as a high chief.</p>
<p>His standing was not based only on ceremony or title.</p>
<p>It was also connected to his visibility, experience, generosity, family position, business activities, and relationships with people in the community.</p>
<p>People approached him for advice, assistance, introductions, mediation, and support.</p>
<p>He was accessible to people from different social and economic backgrounds.</p>
<p>His house and office became places where business, family, and community matters could be discussed.</p>
<p>His influence was therefore built through both personal achievement and service.</p>

<h2>A Humanitarian Spirit</h2>
<p>One of the strongest themes in the life of Baba Muyi was his generosity.</p>
<p>He helped relatives, workers, neighbours, friends, and other people who approached him in need.</p>
<p>He believed in sharing opportunities.</p>
<p>He often placed the needs of others alongside, and sometimes ahead of, his own personal interests.</p>
<p>Many people remember him not simply because of the businesses or property he once controlled but because of the assistance they received from him.</p>
<p>His generosity became part of his public reputation.</p>
<p>It also became one of the most important values remembered by his children.</p>

<h2>His Love for Family Unity</h2>
<p>Baba Muyi believed strongly in family.</p>
<p>He wanted members of the wider Majekodunmi family to remain connected and support one another.</p>
<p>He hoped that relatives would use their collective strength to protect family welfare and create opportunities for future generations.</p>
<p>His support for siblings and extended relatives was influenced by this desire for unity.</p>
<p>He believed that family relationships should be based on cooperation, loyalty, respect, and mutual progress.</p>
<p>Although the outcomes of some relationships did not always reflect his hopes, his desire to unite and uplift the family remained an important part of his character.</p>

<h2>The Price of Trust</h2>
<p>Baba Muyi’s generosity and loyalty to family were among his greatest strengths.</p>
<p>They also exposed him to serious personal and economic risks.</p>
<p>He often trusted people close to him and expected them to protect his interests with the same sincerity that he showed toward them.</p>
<p>However, his life demonstrated that goodwill alone is not always enough to protect businesses, property, documents, or family relationships.</p>
<p>Some of the most painful experiences associated with his later life concerned trust, responsibility, business decline, disputed interests, and the loss of things he had worked hard to build.</p>
<p>These experiences form part of the family’s oral history and should be examined carefully alongside surviving documents and additional testimony.</p>
<p>They should not be presented as settled legal conclusions where independent evidence has not yet been reviewed.</p>
<p>Nevertheless, they offer an important lesson:</p>
<blockquote><p><strong>Kindness must walk together with wisdom, accountability, documentation, and proper protection.</strong></p></blockquote>

<h2>The Loss of Material Wealth</h2>
<p>Over time, Baba Muyi experienced the decline or loss of many assets connected with his years of work.</p>
<p>His transport fleet no longer remained what it had once been.</p>
<p>Some property interests became subjects of disagreement or loss.</p>
<p>The security he had built through decades of entrepreneurship became increasingly weakened.</p>
<p>These experiences caused pain not only to him but also to members of his immediate family.</p>
<p>However, the loss of material possessions did not completely erase the respect people held for him or the memories of the lives he had touched.</p>
<p>His story demonstrates that wealth can disappear, businesses can decline, and property can be lost, but character and human influence can continue beyond material circumstances.</p>

<h2>His Character</h2>
<p>Baba Muyi was remembered as:</p>
<ul>
<li>Kind</li>
<li>Generous</li>
<li>Hardworking</li>
<li>Enterprising</li>
<li>Approachable</li>
<li>Helpful</li>
<li>Family-oriented</li>
<li>Community-minded</li>
<li>Compassionate</li>
<li>Responsible</li>
<li>Trusting</li>
<li>Supportive of others</li>
</ul>
<p>He was not a perfect man, and a responsible biography should not pretend that any human being is perfect.</p>
<p>He made decisions that can now be studied with the benefit of hindsight.</p>
<p>Some choices brought progress, while others exposed him and his household to difficulties.</p>
<p>However, his weaknesses should not be used to erase the sincerity of his service or the scale of the responsibilities he carried.</p>

<h2>A Father to Many</h2>
<p>Baba Muyi’s role as a father extended beyond biological parenthood.</p>
<p>His home, businesses, and community relationships placed him in a position where many people looked to him as a senior figure.</p>
<p>He advised people.</p>
<p>He assisted people.</p>
<p>He gave people opportunities.</p>
<p>He provided employment.</p>
<p>He helped relatives and associates establish themselves.</p>
<p>For this reason, the title “Baba” represented more than his relationship with his children.</p>
<p>It also reflected the way many people experienced his presence within the wider community.</p>

<h2>Lessons from His Life</h2>
<p>Baba Muyi’s life offers important lessons for his descendants and for anyone studying leadership, family, entrepreneurship, and community responsibility.</p>
<h3>Work creates independence</h3>
<p>His journey into transportation showed the value of courage, practical intelligence, hard work, and entrepreneurship.</p>
<h3>Success should benefit others</h3>
<p>His businesses created employment and opened doors for relatives, workers, and associates.</p>
<h3>Character is more enduring than possessions</h3>
<p>Vehicles, businesses, money, and property can disappear, but a good name can remain in people’s memories.</p>
<h3>Leadership requires service</h3>
<p>His community standing came partly from his willingness to listen, assist, advise, and remain accessible.</p>
<h3>Family unity requires accountability</h3>
<p>A family name alone cannot guarantee loyalty, fairness, or cooperation. Unity must be supported by honesty and mutual responsibility.</p>
<h3>Kindness requires wisdom</h3>
<p>Generosity should be protected by boundaries, proper documentation, independent advice, and accountability.</p>
<h3>History must be preserved</h3>
<p>Without documentation, photographs, oral testimonies, and verified records, important family history can be forgotten or rewritten.</p>

<h2>“Iwà Rere Ni Ẹ̀ṣọ́ Ènìyàn”</h2>
<p>A Yoruba proverb that appropriately reflects Baba Muyi’s legacy is:</p>
<blockquote><p><strong>“Iwà rere ni ẹ̀ṣọ́ ènìyàn.”</strong></p></blockquote>
<p>This means:</p>
<blockquote><p><strong>Good character is a person’s finest adornment.</strong></p></blockquote>
<p>Baba Muyi’s material achievements formed an important part of his life, but his strongest legacy is found in the character people remember.</p>
<p>He is remembered for building a transport enterprise.</p>
<p>He is remembered for creating employment.</p>
<p>He is remembered for helping relatives.</p>
<p>He is remembered for welcoming people.</p>
<p>He is remembered for giving.</p>
<p>He is remembered for trying to unite his family.</p>
<p>He is remembered as a man whose kindness often extended beyond the boundaries of his immediate household.</p>

<h2>His Death and Continuing Legacy</h2>
<p>Baba Muyi died in 2008.</p>
<p>His death ended his physical presence, but it did not end his influence.</p>
<p>His life continues through his children, grandchildren, great-grandchildren, family memories, photographs, documents, oral testimonies, and the stories of people who knew him.</p>
<p>His experiences also continue through the lessons that can be learned from both his achievements and his losses.</p>
<p>His story is not being preserved to create a perfect image of him.</p>
<p>It is being preserved to create an honest, respectful, and educational historical record.</p>

<h2>Preserving His Story Through LegacyHub</h2>
<p>The LegacyHub Digital Museum has been created to preserve the life and legacy of Baba Muyi in a permanent and accessible form.</p>
<p>The museum will bring together:</p>
<ul>
<li>His official biography</li>
<li>Family oral histories</li>
<li>Founder interviews</li>
<li>Historical photographs</li>
<li>Documentary videos</li>
<li>Business and transport history</li>
<li>Family-tree records</li>
<li>Timeline entries</li>
<li>Community testimonies</li>
<li>Yoruba cultural knowledge</li>
<li>Educational lessons</li>
<li>Archival documents</li>
<li>Memories from people whose lives he touched</li>
</ul>
<p>The purpose is to ensure that his life is not forgotten, reduced to rumours, or rewritten without reference to the available historical record.</p>
<p>LegacyHub will preserve both achievement and adversity.</p>
<p>It will celebrate his contribution while also allowing future generations to learn from the risks, sacrifices, and disappointments he experienced.</p>

<h2>Closing Reflection</h2>
<p>Alhaji Tioluwalase “Baba Muyi” Majekodunmi lived a life defined by work, family, enterprise, service, generosity, and trust.</p>
<p>He rose from his roots in Abeokuta and Iboogun to become a transport entrepreneur and recognised figure in Bariga.</p>
<p>He created employment.</p>
<p>He supported relatives.</p>
<p>He built a large family.</p>
<p>He helped people who approached him.</p>
<p>He dreamed of unity and collective progress.</p>
<p>He also paid a considerable price for placing trust in people without always having sufficient protection around his assets and interests.</p>
<p>His life therefore leaves future generations with a balanced inheritance of inspiration and instruction:</p>
<blockquote><p>Do good, but be wise.</p><p>Help people, but do not lose yourself.</p><p>Love people, but protect your peace.</p><p>Give, but do not ignore character.</p><p>Be kind, but never confuse kindness with weakness.</p></blockquote>
<p>This is the legacy of Baba Muyi.</p>

<h2>Public Editorial Note</h2>
<p>This biography has been prepared from the personal recollections of Azeez Adeyemi Majekodunmi, existing family writings, documentary materials, photographs, and the Baba Muyi family oral-history collection.</p>
<p>Some dates, business details, property matters, and family accounts remain subject to further verification.</p>
<p>Statements relating to disputed property, family conduct, business loss, document custody, betrayal, or wrongdoing must remain carefully attributed and must not be converted into verified legal conclusions without supporting documentary evidence.</p>
<p>The biography will continue to be expanded as additional records, photographs, interviews, and independent testimonies become available.</p>
<ul>
<li>Editorial version: BIOGRAPHY_EDITORIAL_PACK_v1.0</li>
<li>Publication status: Approved</li>
<li>Collection: Baba Muyi Family and Community History Collection</li>
<li>Content type: Museum Biography</li>
<li>Language: English</li>
<li>Verification basis: Family oral history and available archival materials</li>
<li>Editorial attribution: Written and documented by Azeez Adeyemi Majekodunmi.</li>
</ul>
  `.trim(),
  status: "published",
  visibility: "public",
  verificationStatus: "partially_verified",
  sortOrder: 1,
  relatedPath: "/biography",
  category: "Baba Muyi Family and Community History Collection",
  author: "Azeez Adeyemi Majekodunmi",
  seoTitle: "Alhaji Tioluwalase “Baba Muyi” Majekodunmi | Official Biography",
  metaDescription:
    "Explore the life, entrepreneurial journey, family values, community service, and enduring legacy of Alhaji Tioluwalase “Baba Muyi” Majekodunmi, preserved by the LegacyHub Digital Museum.",
  createdAt: implementedAt,
  updatedAt: implementedAt,
  lastEditorId: "BIOGRAPHY_EDITORIAL_PACK_v1.0"
};
