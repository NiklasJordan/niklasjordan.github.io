---
layout: home
authorbox: nope
---

# I use technology to understand a changing planet.

Hej – I am Niklas 👋,\
full-time technology advocate – part-time Earth science student!

I am passionate about natural hazards, Earth observation, climate, data science, open data, low-cost technology, human rights & tech ethics. Yep, I have lots of interests. *Oh wait*, one more thing to know: I love rough weather!

👨‍💻 Technologist, with focus on exploring and defending Earth and society.\
🔬 Studying Earth Science at The Open University.\
🛰 Democratize satellite data with [OpenSpaceData.org](https://www.openspacedata.org).\
🌋 Founder of [DisasterTech](https://www.disaster-tech.org/), a community that help people in crisis situations.\
🎙 Hosting the [Hotspot Podcast](https://www.hotspot-podcast.de/) about natural hazards.\
🌳 Writing a monthly newsletter about [People, Planet & Technology](https://www.niklasjordan.com/newsletter.html).

[Get to know more about me.](/about)

## Last articles
{% if site.posts.size > 0 %}
  <ul>
    {% for post in site.posts limit:5 %}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      </li>
    {% endfor %}
  </ul>
{% endif %}

{% include newsletter.html %}