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
  body: "Approved for publication as Biography Editorial Pack v1.0.",
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
  "Editorial version: Biography Editorial Pack v1.0",
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
<h2>Chapter One: A Life Worth Remembering</h2>
<p>Alhaji Tioluwalase Majekodunmi, popularly known as “Baba Muyi,” was an entrepreneur, transport operator, family patriarch, community figure, high chief, and humanitarian whose life became closely connected with the social and commercial history of Bariga, Lagos.</p>
<p>To many people, he was known simply as Alhaji or Baba Muyi. The name “Baba Muyi” came from his first child, Muyi, in accordance with the familiar Yoruba custom of respectfully identifying a parent through the name of their child.</p>
<p>To his children, however, he was much more than a public name. He was their father, provider, adviser, disciplinarian, protector, and the central figure of a large and complex family.</p>
<p>His life was defined by enterprise, generosity, responsibility, service, family loyalty, personal sacrifice, and a deep desire to help others progress.</p>
<p>Baba Muyi’s life deserves preservation because it reflects the kind of history that is often carried quietly by families and communities. Not every person who shapes a society appears in formal history books. Many are remembered through the people they helped, the values they lived by, the businesses they built, and the responsibilities they carried.</p>
<p>His story is therefore not only about vehicles, property, or public recognition. It is about relationships, work, service, trust, family responsibility, and the influence one person can have on many lives. The biography preserves both achievement and hardship so that future generations can understand him as a real human being rather than a flawless hero or a tragic figure.</p>
<p>Through Baba Muyi’s story, the archive also preserves a chapter of Nigerian family and social history: movement from older family roots into Lagos, the growth of Bariga, the importance of public transportation, and the weight of leadership within a large household and community.</p>

<h2>Chapter Two: Early Life: The Roots That Shaped a Leader</h2>
<p>Baba Muyi was born in Abeokuta, in present-day Ogun State, Nigeria.</p>
<p>His family roots were also closely connected to Iboogun, the village where his parents lived and where they were eventually buried.</p>
<p>During his younger years, he moved between Abeokuta and Iboogun before beginning a new chapter of his life in Lagos.</p>
<p>His upbringing was shaped by Yoruba family values, respect for elders, communal responsibility, hard work, oral tradition, and the belief that a person’s success should also benefit the people around them.</p>
<p>These values remained visible throughout his adult life.</p>
<p>Abeokuta and Iboogun are important to this story because they represent more than geography. They preserve the roots from which Baba Muyi’s character, family identity, and sense of responsibility developed. The approved family account connects him to a world where elders, lineage, community reputation, and moral conduct mattered deeply.</p>
<p>The connection to Iboogun is especially significant because his parents lived, died, and were buried there. This gives the archive a family-rooted point of reference for understanding the man who later became known in Bariga as Baba Muyi.</p>
<p>The values associated with this early formation help explain later chapters of his life: his openness to helping others, his belief in family unity, his work ethic, and his expectation that success should be shared rather than held selfishly.</p>

<h2>Chapter Three: From Iboogun to Bariga: The Journey That Changed Everything</h2>
<p>As a young man, Baba Muyi left Iboogun and moved to Bariga, Lagos.</p>
<p>At the time of his arrival, parts of Bariga were still developing and were very different from the densely populated urban community known today.</p>
<p>The area contained undeveloped land, narrow roads, footpaths, and sections that were still surrounded by vegetation.</p>
<p>Moving to Bariga required courage, adaptability, and a willingness to build a future in a changing environment.</p>
<p>Baba Muyi became part of the generation whose work, businesses, homes, and community relationships contributed to the development of the area.</p>
<p>Bariga later became central to his family life, business activities, public identity, and historical legacy.</p>
<p>The movement from Iboogun to Bariga was not simply a change of address. It was a turning point that placed him within a growing Lagos community where determination and practical judgement could create opportunity. The approved biography presents Bariga as a place still in transition, not yet the dense urban environment known today.</p>
<p>For a young man seeking a future, that environment demanded resilience. It required a willingness to leave familiar roots, form new relationships, earn trust, and participate in the daily life of a community that was still taking shape.</p>
<p>This chapter matters because Bariga became the setting in which Baba Muyi’s identity expanded. It connected his family life, public name, transport enterprise, community leadership, and long-term memory. Without the decision to build a life there, the later story of his business and public influence would have unfolded very differently.</p>

<h2>Chapter Four: Building a Dream: The Birth of an Entrepreneur</h2>
<p>Baba Muyi became an entrepreneur at a relatively young age.</p>
<p>He ventured into transportation during an important period in the development of public transport in Lagos.</p>
<p>His early involvement was associated with the wooden passenger vehicles popularly known as Bolekaja.</p>
<p>The name “Bolekaja,” often interpreted as “come down and let us fight,” reflected the lively and sometimes confrontational atmosphere associated with early commercial passenger transport.</p>
<p>These vehicles played an important role in moving workers, traders, families, and other passengers through Lagos before more modern forms of public transportation became widely available.</p>
<p>Baba Muyi recognised transportation as both a business opportunity and a necessary public service.</p>
<p>The approved biography frames entrepreneurship as one of the defining parts of Baba Muyi’s life. His entry into transportation showed courage, practical intelligence, and an ability to recognise where a growing community needed service.</p>
<p>Public transport was not only a way to earn income. It connected people to markets, work, schools, businesses, worship, and family obligations. By entering this field, Baba Muyi became part of a wider system that helped Lagos residents move through the demands of daily life.</p>
<p>His early transport work also shows that enterprise was never only personal ambition. The business would later create work for drivers, conductors, mechanics, assistants, and others whose households depended on the opportunities that transport created. This is why the biography treats his business life as both economic history and community history.</p>

<h2>Chapter Five: From Bolekaja to TIOLUWA LASE: A Legacy on the Roads of Lagos</h2>
<p>As Lagos developed, its transportation system also changed.</p>
<p>The earlier wooden Bolekaja vehicles were gradually followed by larger buses that became important to public transportation in Lagos.</p>
<p>Baba Muyi successfully moved with this development.</p>
<p>His transport vehicles carried the inscription:</p>
<blockquote><p><strong>TIOLUWA LASE</strong></p></blockquote>
<p>The name became associated with his business and identity.</p>
<p>His buses operated along routes connecting communities and commercial centres, including Bariga, Yaba, Oyingbo, Idumota, and surrounding areas.</p>
<p>His transport business was not only a personal source of income. It also created work for drivers, conductors, mechanics, assistants, and other people whose families depended upon the enterprise.</p>
<p>Through transportation, Baba Muyi helped people travel to work, markets, schools, businesses, family homes, and other destinations across Lagos.</p>

<h3>Building People Through Business</h3>
<p>One of the defining qualities of Baba Muyi’s entrepreneurship was his belief that success should not benefit only one person.</p>
<p>His business created opportunities for others.</p>
<p>Workers earned livelihoods through his vehicles.</p>
<p>Relatives received assistance.</p>
<p>People seeking employment or economic support often came to him.</p>
<p>He also assisted some of his siblings by giving them opportunities to participate in transportation and establish livelihoods of their own.</p>
<p>This reflected a principle that remained central to his life: a successful person should help other people rise.</p>
<p>He was not interested only in building vehicles, businesses, houses, or properties.</p>
<p>He was also interested in building people.</p>

<h3>The Family Patriarch</h3>
<p>Baba Muyi was the father of twenty-seven children and led a large family household.</p>
<p>Managing such a family required considerable responsibility.</p>
<p>He had to balance the needs of his wives, children, relatives, workers, visitors, business associates, and members of the wider community.</p>
<p>His family home was frequently active.</p>
<p>Children, relatives, friends, employees, neighbours, and visitors moved through the household.</p>
<p>People came to speak with him, seek assistance, receive advice, discuss business matters, or spend time in his company.</p>
<p>His responsibilities therefore extended well beyond ordinary parenting.</p>
<p>He became the central figure in a broad network of family and community relationships.</p>

<h3>Why People Called Him Baba Muyi</h3>
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

<h2>Chapter Six: Beyond Business: A Leader Who Served His Community</h2>
<p>Baba Muyi was recognised as a high chief.</p>
<p>His standing was not based only on ceremony or title.</p>
<p>It was also connected to his visibility, experience, generosity, family position, business activities, and relationships with people in the community.</p>
<p>People approached him for advice, assistance, introductions, mediation, and support.</p>
<p>He was accessible to people from different social and economic backgrounds.</p>
<p>His house and office became places where business, family, and community matters could be discussed.</p>
<p>His influence was therefore built through both personal achievement and service.</p>

<h3>A Humanitarian Spirit</h3>
<p>One of the strongest themes in the life of Baba Muyi was his generosity.</p>
<p>He helped relatives, workers, neighbours, friends, and other people who approached him in need.</p>
<p>He believed in sharing opportunities.</p>
<p>He often placed the needs of others alongside, and sometimes ahead of, his own personal interests.</p>
<p>Many people remember him not simply because of the businesses or property he once controlled but because of the assistance they received from him.</p>
<p>His generosity became part of his public reputation.</p>
<p>It also became one of the most important values remembered by his children.</p>

<h2>Chapter Seven: Family, Responsibility and Sacrifice</h2>
<p>Baba Muyi believed strongly in family.</p>
<p>He wanted members of the wider Majekodunmi family to remain connected and support one another.</p>
<p>He hoped that relatives would use their collective strength to protect family welfare and create opportunities for future generations.</p>
<p>His support for siblings and extended relatives was influenced by this desire for unity.</p>
<p>He believed that family relationships should be based on cooperation, loyalty, respect, and mutual progress.</p>
<p>Although the outcomes of some relationships did not always reflect his hopes, his desire to unite and uplift the family remained an important part of his character.</p>
<p>The approved biography records Baba Muyi as the father of twenty-seven children. That responsibility shaped the scale of his household life and the expectations placed upon him. He was not only managing his personal affairs; he was carrying the needs of a large family, relatives, workers, visitors, and members of the wider community.</p>
<p>Within the family, he was remembered as a provider, adviser, disciplinarian, protector, and central figure. People came to him for help, counsel, and support. This made family leadership a daily responsibility rather than a ceremonial role.</p>
<p>The chapter also preserves the sacrifice that came with such responsibility. A large family and an open-handed approach to relatives and community required time, resources, patience, and emotional strength. His desire for family unity remains one of the key values the archive preserves, even while acknowledging that family relationships can be complicated and must be remembered with honesty.</p>

<h2>Chapter Eight: When Blind Trust Became the Price of Doing Good</h2>
<p>Perhaps one of the greatest lessons my father unknowingly taught us was this:</p>
<p><strong>Kindness without wisdom can become dangerous.</strong></p>
<p>My father was naturally generous, trusting and deeply committed to family. He believed that people who shared blood, history and responsibility should also share loyalty. Because of that belief, he often placed great confidence in members of his extended family and expected the same honesty from them that he showed to others.</p>
<p>In some cases, he entrusted important property documents to close relatives for safekeeping. To him, this was not carelessness. It was an expression of trust.</p>
<p>He did not expect that documents handed over in good faith could later become connected to disputes over property, ownership and family responsibility.</p>
<p>According to family recollections, several landed properties were later allegedly taken over, transferred or sold without his consent. These accounts form part of the family’s oral history and should be treated carefully, especially where complete documentary records have not yet been independently reviewed.</p>
<p>One of the most serious disputes reportedly involved an elder sibling and developed into a legal battle during the 1980s. Family accounts also recall that the matter attracted public and media attention at the time.</p>
<p>The consequences were not simply financial.</p>
<p>The loss of property represented years of hard work, sacrifice and planning. These were not things that appeared overnight. They were connected to the effort of a man who had worked from a young age, built businesses, invested in property and tried to create security for a very large family.</p>
<p>When property is lost, the financial value can sometimes be calculated.</p>
<p>But the emotional cost of betrayal is much harder to measure.</p>
<p>For my father, the deepest wound was not only the possibility of losing land or property.</p>
<p>It was the collapse of trust.</p>
<p>He had spent much of his life helping people, supporting relatives and believing strongly in family responsibility. To discover that trust could become a source of vulnerability must have been deeply painful.</p>
<p>Yet I do not believe the lesson of his experience is that generosity was a mistake.</p>
<p>His kindness was part of who he was.</p>
<p>His willingness to help people was one of the qualities for which many remembered him.</p>
<p>The greater lesson is that <strong>good intentions need protection</strong>.</p>
<p>Trust should be accompanied by proper documentation.</p>
<p>Property should be legally protected.</p>
<p>Important documents should be securely retained.</p>
<p>Family arrangements should be clearly recorded.</p>
<p>Business interests should not depend only on verbal promises or personal relationships.</p>
<p>And generosity should never remove the need for accountability.</p>
<p>My father came from a generation in which trust, family honour and personal relationships often carried enormous weight. A handshake, a promise or the word of a respected relative could sometimes be treated as stronger than formal documentation.</p>
<p>But society changes.</p>
<p>Families grow.</p>
<p>Interests change.</p>
<p>Memories differ.</p>
<p>And circumstances can expose weaknesses that were never anticipated.</p>
<p>That is why this part of his story remains one of the most practical lessons for future generations.</p>
<p>Love your family.</p>
<p>Support people when you can.</p>
<p>Be generous.</p>
<p>But also protect what you have worked for.</p>
<p>Keep records.</p>
<p>Seek proper advice.</p>
<p>Understand what you sign.</p>
<p>Know where your documents are.</p>
<p>Make ownership clear.</p>
<p>And never assume that affection alone is enough to protect important family or business interests.</p>
<p>There is a Yoruba wisdom behind this lesson: kindness and wisdom must walk together.</p>
<p>A good heart should never be abandoned.</p>
<p>But a good heart also needs good judgement.</p>
<p>Looking back, I believe the most painful price my father paid was not measured only in money, buildings or land.</p>
<p><strong>The greatest wound was not losing property.</strong></p>
<p><strong>It was losing trust.</strong></p>
<p>And perhaps that is why this lesson deserves to be remembered by every generation that comes after him:</p>
<blockquote><p><strong>Do good, but be wise.<br>Help people, but protect what you have built.<br>Trust people, but keep proper records.<br>Love your family, but never abandon accountability.</strong></p></blockquote>
<p>That is not a rejection of kindness.</p>
<p>It is kindness strengthened by wisdom.</p>

<h2>Chapter Nine: Later Years: Resilience Through Change</h2>
<p>Over time, Baba Muyi experienced the decline or loss of many assets connected with his years of work.</p>
<p>His transport fleet no longer remained what it had once been.</p>
<p>Some property interests became subjects of disagreement or loss.</p>
<p>The security he had built through decades of entrepreneurship became increasingly weakened.</p>
<p>These experiences caused pain not only to him but also to members of his immediate family.</p>
<p>However, the loss of material possessions did not completely erase the respect people held for him or the memories of the lives he had touched.</p>
<p>His story demonstrates that wealth can disappear, businesses can decline, and property can be lost, but character and human influence can continue beyond material circumstances.</p>

<h3>His Character</h3>
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

<h3>A Father to Many</h3>
<p>Baba Muyi’s role as a father extended beyond biological parenthood.</p>
<p>His home, businesses, and community relationships placed him in a position where many people looked to him as a senior figure.</p>
<p>He advised people.</p>
<p>He assisted people.</p>
<p>He gave people opportunities.</p>
<p>He provided employment.</p>
<p>He helped relatives and associates establish themselves.</p>
<p>For this reason, the title “Baba” represented more than his relationship with his children.</p>
<p>It also reflected the way many people experienced his presence within the wider community.</p>

<h3>Lessons from His Life</h3>
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

<h3>“Iwà Rere Ni Ẹ̀ṣọ́ Ènìyàn”</h3>
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

<h2>Chapter Ten: An Enduring Legacy</h2>
<p>Baba Muyi died in 2008.</p>
<p>His death ended his physical presence, but it did not end his influence.</p>
<p>His life continues through his children, grandchildren, great-grandchildren, family memories, photographs, documents, oral testimonies, and the stories of people who knew him.</p>
<p>His experiences also continue through the lessons that can be learned from both his achievements and his losses.</p>
<p>His story is not being preserved to create a perfect image of him.</p>
<p>It is being preserved to create an honest, respectful, and educational historical record.</p>

<h3>Preserving His Story Through LegacyHub</h3>
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

<h3>Closing Reflection</h3>
<p>Alhaji Tioluwalase “Baba Muyi” Majekodunmi lived a life defined by work, family, enterprise, service, generosity, and trust.</p>
<p>He rose from his roots in Abeokuta and Iboogun to become a transport entrepreneur and recognised figure in Bariga.</p>
<p>He created employment.</p>
<p>He supported relatives.</p>
<p>He built a large family.</p>
<p>He helped people who approached him.</p>
<p>He dreamed of unity and collective progress.</p>
<p>He also paid a considerable price for placing trust in people without always having sufficient protection around his assets and interests.</p>
<p>His life therefore leaves future generations with a balanced inheritance of inspiration and instruction:</p>
<ul>
<li>Do good with wisdom.</li>
<li>Help people while preserving responsibility.</li>
<li>Love people while protecting peace and accountability.</li>
<li>Give without ignoring character.</li>
<li>Practice kindness with discernment.</li>
</ul>
<p>This is the legacy of Baba Muyi.</p>

<h3>Public Editorial Note</h3>
<p>This biography has been prepared from the personal recollections of Azeez Adeyemi Majekodunmi, existing family writings, documentary materials, photographs, and the Baba Muyi family oral-history collection.</p>
<p>Some dates, business details, property matters, and family accounts remain subject to further verification.</p>
<p>Statements relating to disputed property, family conduct, business loss, document custody, betrayal, or wrongdoing must remain carefully attributed and must not be converted into verified legal conclusions without supporting documentary evidence.</p>
<p>The biography will continue to be expanded as additional records, photographs, interviews, and independent testimonies become available.</p>
<ul>
<li>Editorial version: Biography Editorial Pack v1.0</li>
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
