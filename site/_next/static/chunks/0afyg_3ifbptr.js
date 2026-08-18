(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,916367,924887,951233,177968,819147,243963,941190,580299,337762,e=>{"use strict";var t=e.i(524677);let a=`
  id,
  _key,
  "text": select(
    count(text[]) > 0 => coalesce(
      text[language == $lang][0].value,
      text[language == 'en'][0].value,
      text[0].value
    ),
    text
  ),
  navigationItemUrl {
    linkType,
    internalLink -> {
      _type,
      title,
      "slug": coalesce(
        slug.current,
        store.slug.current
      ),
    },
    product -> {
      _id,
      "slug": store.slug.current,
    },
    href,
    blank,
    modalText
  }
`,r=`
  id,
  _key,
  "text": coalesce(
    text[language == $lang][0].value,
    text[language == 'en'][0].value,
  ),
  columns,
  navigationItemUrl {
    linkType,
    internalLink -> {
      _type,
      language,
      "title": coalesce(
        *[_type == "translation.metadata" && references(^._id)][0].translations[language == $lang][0].value->title,
        title,
        *[_type == "translation.metadata" && references(^._id)][0].translations[language == $lang][0].value->store.title,
        store.title,
        title,
      ),
      "slug": coalesce(
        *[_type == "translation.metadata" && references(^._id)][0].translations[language == $lang][0].value-> slug.current,
        slug.current,
        store.slug.current
      ),
      "lang": coalesce(
        *[_type == "translation.metadata" && references(^._id)][0].translations[language == $lang][0].value->language,
        language
      ),
    },
    href,
    blank
  }
`,l=t.groq`
  button {
    ${a},
    variant,
  }
`,n=`
  "alt": coalesce(asset->altText, alt),
  asset,
  crop,
  customRatio,
  hotspot,
  "height": asset->metadata.dimensions.height,
  "width": asset->metadata.dimensions.width,
  "id": asset->assetId,
  "type": asset->mimeType,
  "aspectRatio": asset->metadata.dimensions.aspectRatio,
  "lqip": asset->metadata.lqip,
  "dominantColor": asset->metadata.palette.dominant.background,
  "darkVibrant": asset->metadata.palette.darkVibrant.background
`,i=`
  video {
    videoUrl,
    "videoPreview": videoPreview.asset->.fileURL
  }
`,s=`
  seo {
    ...,
    metaTitle,
    metaDesc,
    ogImage,
    noIndex,
    noFollow,
    transcript,
  }
`,o=`
  ...,
  _type == 'imageWithAlt' => {
    ${n},
    link {
      linkType,
      internalLink -> {
        _type,
        title,
        "slug": coalesce(
          slug.current,
          store.slug.current
        )
      },
      href,
      blank,
      modalText
    }
  },
  _type == 'hubspotForm' => {
    ...,
    formId,
    portalId,
    redirects {
      redirectURL,
      redirectURLDisqualified,
      redirectURLHighValue
    }
  },
  _type == 'bannerAd' => {
    image {
      ${n}
    },
    text,
    buttonLabel,
    link {
      linkType,
      internalLink -> {
        _type,
        title,
        "slug": coalesce(
          slug.current,
          store.slug.current
        )
      },
      href,
      blank,
      modalText
    }
  },
  _type == 'iconList' => {
    iconList[] {
      icon {
        ${n}
      },
      text[] {
        ...,
        markDefs[] {
          ...,
          internalLink-> {
            _type,
            title,
            "slug": slug.current
          }
        }
      }
    }
  },
  _type == 'imageAndTextList' => {
    list[] {
      image {
        ${n}
      },
      heading,
      text
    }
  },
  _type == 'button' => {
    variant,
    width,
    ${a}
  },
  _type == 'link' => {
    linkType,
    internalLink {
      _type,
      title,
      "slug": slug.current
    },
    href,
    blank,
    modalText
  },
  _type == 'blogBannerAd' => {
    'blogBannerAd': @->{
    _id,
    _type,
    image {
      ${n}
    },
    text,
    buttonLabel,
    link
    }
  },
  _type == 'eventSelectionForm' => {
    'eventSelectionForm': @->{
      _id,
      title,
      plans[],
      options[],
      confirmationUrl
    }
  },
  _type == 'formReference' => {
    _type,
    _key,
    'form': @->{
      _id,
      formTitle,
      isMultiStep,
      progressIndicatorStyle,
      ctaButtonText,
      formFields[]{
        _key,
        label,
        fieldType,
        required,
        placeholder,
        options[],
        crmProperty{
          name,
          label,
          fieldType,
          options[]
        }
      },
      steps[]{
        headline,
        description,
        fields[]{
          _key,
          label,
          fieldType,
          required,
          placeholder,
          options[],
          crmProperty{
            name,
            label,
            fieldType,
            options[]
          }
        }
      },
      confirmationAction {
        actionType,
        destinationType,
        internalPage -> {
          _type,
          "slug": coalesce(slug.current, store.slug.current)
        },
        externalDestination -> {
          url
        },
        confirmationUrl,
        confirmationMessage
      }
    }
  }
`,u=`
  ...,
  _type == 'imageWithAlt' => {
    alt,
    asset,
    crop,
    hotspot
  },
  _type == 'video' => {
    video {
      videoUrl,
      videoPreview
    }
  },
  _type == 'videoEmbed' => {
    videoUrl
  },
  _type == 'hubspotForm' => {
    formId,
    portalId
  },
  _type == 'code' => {
    code
  },
  _type == 'button' => {
    text,
    variant,
    width
  }
`,c=`
  "heading": documentAttributes.heading,
  "summary": documentAttributes.summary,
  "color": documentAttributes.color.hex,
  "mainImage": documentAttributes.mainImage {
    ${n}
  },
  "titleLockup": documentAttributes.titleLockup {
    ${n}
  },
  "video": documentAttributes.video {
    videoUrl,
    "videoPreview": videoPreview.asset->.fileURL
  }
`,d=`
  _id,
  title,
  excerpt,
  mainImage {
    ${n}
  },
  "audio": audio.asset->fileURL,
  duration,
  publishedAt,
  "slug": slug.current,
  themes[]->{
    title,
    "slug": slug.current,
  },
  event[]->{
    title,
    "slug": slug.current,
  },
`,g=t.groq`
  _id,
  title,
  heading,
  startDate,
  endDate,
  location,
  eventLocation {
    type,
    location
  },
  timezone,
  salesActive,
  external_url,
  event -> {
    "slug": slug.current,
  },
  "salesInactiveContent": coalesce(
      salesInactiveContent[language == $lang][0],
      salesInactiveContent[language == 'en'][0]
    ).value,
  "slug": slug.current,
  ticketTypes[]->{
    _id,
    title,
    "displayName": coalesce(
      displayName[language == $lang][0],
      displayName[language == 'en'][0]
    ).value,
    "description": coalesce(
      description[language == $lang][0],
      description[language == 'en'][0]
    ).value,
    price
  }
`,p=t.groq`
  _id,
  title,
  ${c},
  eventType,
  "slug": slug.current,
  headerButton {
    ${a}
  },
  noEventInstancesContent[] {
    ${o}
  },
  "nextEvent": coalesce(
    activeEventInstance-> {
      ${g}
    },
    *[_type == "eventInstance" && references(^._id) && endDate > now()] | order(startDate asc, _createdAt desc)[0]{
      ${g}
    }
  )
`,m=t.groq`
  _id,
  name,
  role,
  quote,
  avatar {
    ${n}
  },
  bgImage {
    ${n}
  },
  event -> {
    ${c}
  },
  ${i}
`,y=`
  _type == 'eventsCarousel' => {
    title,
    richText[] {
      ${o}
    },
    carouselHeading,
    button {
      ${a}
    },
    carouselDisplay,
    events[] -> {
      ${p},
    }
  }
`,_=`
  _type == 'freeCarousel' => {
    heading,
    richText[] {
      ${o}
    },
    button {
      buttonStyle,
      ${a}
    },
    slides[] {
      text,
      mobileText,
      image {
        ${n}
      },
     ${i}
    }
  }
`,$=`
  _type == 'testimonySwimlane' => {
    title,
    richText[] {
      ${o}
    },
    display,
    centerAlign,
    showEvent,
    testimonies[] -> {
      ${m}
    }
  }
`,h=`
  _type == 'reelsSwimlane' => {
    title,
    ${l},
    videos[]{
      videoUrl,
      "videoPreview": videoPreview.asset->.fileURL
    }
  }
`,v=`
  _type == 'themeRollover' => {
    title,
    defaultImage {
      ${n}
    },
    themes[] -> {
      _id,
      "slug": slug.current,
      title,
      "mainImage": documentAttributes.mainImage {
        ${n}
      },

    }
  }
`,b=`
  _type == 'textAndMedia' => {
    richText[] {
      ${o}
    },
    image {
      ${n}
    },
    ${i},
    flipOrder
  }
`,f=`
  _type == 'video' => {
    richText[] {
      ${o}
    },
    image {
      ${n}
    },
    ${i},
  }
`,T=`
  _type == 'richTextModule' => {
    richText[] {
      ${o}
    },
    bgImage {
      ${n}
    },
    centerText
  }
`,k=`
  _type == 'headingAndText' => {
    heading,
    richText[] {
      ${o}
    }
  }
`,x=`
  _type == 'twoColumnContent' => {
    col1[] {
      ${o}
    },
    col2[] {
      ${o}
    },
    layout,
    columnType,
    checkoutFormCol2,
  }
`,I=`
  _type == 'imageBanner' => {
      image {
        ${n}
      }
  }
`,P=`
  _type == 'imageOutOfSideScreenAndText' => {
    richText[] {
      ${o}
    },
    image {
      ${n}
    },
    ${i},
    flipOrder
  }
`,A=`
  _type == 'codeEmbed' => {
    code
  }
`,q=`
  _type == 'collectionSwimlane' => {
    richText[] {
      ${o}
    },
    heading,
    button {
      ${a}
    },
    collections[] {
        _key,
        label,
        collection -> {
          _id,
          "title": store.title,
          "slug": store.slug.current,
        }
    }
  }
`,S=`
  _type == 'relatedProducts' => {
    richText[] {
      ${o}
    },
    heading,
    button {
      ${a}
    },
  }
`,D=`
  _type == 'programProductInclusions' => {
    heading,
    richText,
    products[]{
      product-> {
        "price": store.variants[0]->store.price,
        "title": store.title,
        "image": productGallery[0] {
          ${n}
        },
        "slug": store.slug.current,
      },
      description[] {
        ${o}
      }
    }
  }
`,L=`
  _type == 'programSubscriptions' => {
    richText[] {
      ${o}
    },
    settings,
  }
`,U=`
  _type == 'embeddedCheckoutModule' => {
    orderForm
  }
`,C=`
  _type == 'featureGrid' => {
    richText[] {
      ${o}
    },
    centerText,
    iconAlignment,
    grid[]{
      icon{
        ${n}
      },
      heading,
      richText[] {
        ${o}
      },
    },
    display
  }
`,B=`
  _type == 'profileGrid' => {
    richText[] {
      ${o}
    },
    profiles[] {
      ...,
      image{
        ${n}
      }
    },
    centerText,
    display
  }
`,M=`
  _type == 'programsAndEventsGrid' => {
    heading,
    summary[] {
      ${o}
    },
    entries[] {
      entry->{
        _id,
        _type,
        title,
        ${c},
        "slug": slug.current,
        _type == 'event' => {
          eventType,
          "nextEvent": coalesce(
            activeEventInstance-> {
              ${g}
            },
            *[_type == "eventInstance" && references(^._id) && endDate > now()] | order(startDate asc, _createdAt desc)[0]{
              ${g}
            }
          )
        },
      },
      wide,
      _key
    },
  }
`,R=`
  _type == 'modularGridFeatureList' => {
    richText[] {
      ${o}
    },
    grid[]{
      icon{
        ${n}
      },
      heading,
      richText[] {
        ${o}
      },
    },
  }
`,w=`
  _type == 'processSlides' => {
    heading,
    slideInterval,
    steps[] {
      heading,
      richText[] {
        ${o}
      },
      image {
        ${n}
      }
    }
  }
`,H=`
  _type == 'schedule' => {
    heading,
    items[] {
      label,
      heading,
      richText[] {
        ${o}
      },
      image{
        ${n}
      }
    },
    flipOrder
  }
`,Q=`
  _type == 'bookGrid' => {
    books[] {
      _key,
      title,
      byLine,
      image {
        ${n}
      },
      link {
        linkType,
        internalLink -> {
          _type,
          title,
          "slug": coalesce(
            slug.current,
            store.slug.current
          ),
        },
        product -> {
          _id,
          "slug": store.slug.current,
        },
        href,
        blank,
        modalText
      }
    },
  }
`,F=`
  _type == 'homeHero' => {
    title,
    subhead,
    bgImage {
      ${n}
    },
    ${l},
    featureHeading,
    featuredEvent -> {
      ${c},
      _id,
      _type,
      "slug": slug.current
    }
  }
`,V=`
  _type == 'callToAction' => {
    title,
    richText[] {
      ${o}
    },
    bgImage {
      ${n}
    },
    "bgVideo": bgVideo.asset->fileURL,
    button {
      ${a},
      action,
      drawerContent
    },
    leftAligned,
    fadeOut
  }
`,G=`
  _type == 'pageHeader' => {
    ${l},
  }
`,N=`
  _type == 'modularContainerEventProgram' => {
    heading,
    flipOrder,
    invertLogoColor,
    richText[] {
      ${o}
    },
    relation -> {
      _id,
      title,
      ${c},
    },
    largeHeading
  }
`,O=`
  _type == 'modularContainerFeaturedIn' => {
    heading,
    flipOrder,
    richText[] {
      ${o}
    },
    mainImage {
      ${n}
    },
    logos[] {
      ${n}
    },
    ${i},
    logosHeading,
    "color": color.hex,
    largeHeading
  }
`,E=`
  _type == 'modularContainerHeader' => {
    richText[] {
      ${o}
    },
    image {
      ${n}
    },
    ${i},
  }
`,z=`
  _type == 'modularContainerFreeform' => {
    heading,
    flipOrder,
    videoPlacement,
    richText[] {
      ${o}
    },
    primaryImage {
      ${n}
    },
    secondaryImage {
      ${n}
    },
    ${i},
    "color": color.hex,
    largeHeading
  }
`,Y=`
  _type == 'relatedPosts' => {
    display,
    title,
    heading,
    richText[] {
      ${o}
    },
    button {
      ${a}
    },
    manualSelection,
    selectedPosts[]-> {
      ${d}
    }
  }
`,K=`
  _type == 'relatedPodcasts' => {
    title,
    button {
      ${a}
    },
  }
`,j=`
  _type == 'relatedEvents' => {
    heading,
    button,
    display
  }
`,W=`
  _type == 'eventsByTheme' => {
    heading,
    button {
      ${a}
    },
    "theme": theme->slug.current
  }
`,J=`
  _type == 'accordion' => {
    heading[] {
      ${o}
    },
    items[]
  }
`,X=`
  _type == 'quoteAndVideo' => {
    testimony-> {
      ${m}
    },
    "color": color.hex,
    flipOrder
  }
`,Z=`
  _type == 'eventTickets' => {
    richText[] {
      ${o}
    }
  }
`,ee=`
  _type == 'professionalTestimonies' => {
    testimonies[]-> {
      name,
      role,
      quote,
      avatar {
        ${n}
      }
    }
  }
`,et=`
  _type == 'celebrityTestimonials' => {
    testimonials[] -> {
      _id,
      name,
      role,
      quote,
      avatar {
        ${n}
      },
      bgImage {
        ${n}
      },
      event -> {
        titleLockup {
          ${n}
        },
      }
    },
    backgroundImages,
    label,
    fadeOut,
    largeText,
  }
`,ea=`
  _type == 'pressTestimonials' => {
    testimonials[] -> {
      _id,
      name,
      role,
      quote,
      avatar {
        ${n}
      },
    },
  }
`,er=`
  _type == 'podcastsBlock' => {
    heading,
    podcasts[]-> {
      title,
      audio,
      duration,
      "slug": slug.current,
      publishedAt,
      mainImage {
        ${n}
      },
      themes[]-> {
        title
      }
    }
  }
`,el=`
  _type == 'statsBlock' => {
    richText[] {
      ${o}
    },
    stats,
    centerText,
    cols,
  }
`,en=`
  _type == 'tiles' => {
    tiles[] {
      image {
        ${n}
      },
      richText[] {
        ${o}
      },
      button{
        ${a},
        buttonStyle
      },
    }
  }
`,ei=`
  _type == 'scrubOnScroll' => {
    heading,
    "video": video.asset->fileURL ,
    slides
  }
`,es=`
  _type == 'documentaryHeader' => {
    label
  }
`,eo=`
  _type == 'documentaryDescription' => {
    heading,
    credits,
    description,
    image {
      ${n}
    },
    ${l}
  }
`,eu=`
  _type == 'blogHeader' => {
    label,
    title,
    image {
      ${n}
    },
  }
`,ec=`
  _type == 'bookInfo' => {
    ...,
    title,
    byLine,
    image {
      ${n}
    },
    description[] {
      ${o}
    },
    navigationItemUrl {
      linkType,
      internalLink -> {
        _type,
        title,
        "slug": coalesce(
          slug.current,
          store.slug.current
        ),
      },
      product -> {
        _id,
        "slug": store.slug.current,
      },
      href,
      blank,
      modalText
    }
  }
`,ed=`
  _type == "multiStep" => {
    settings,
    steps[]{
      icon,
      headline,
      subheadline,
      richText {
        richText[] {
          ${o}
        },
      },
      image,
      layout
    },
  }
`,eg=t.groq`
  modules[]{
    _key,
    _type,
    settings {
    ...,
      id,
      theme,
      backgroundAsPageColor,
      paddingBottom,
      paddingTop
    },
    ${F},
    ${V},
    ${et},
    ${q},
    ${U},
    ${S},
    ${N},
    ${O},
    ${E},
    ${z},
    ${v},
    ${y},
    ${b},
    ${f},
    ${Y},
    ${K},
    ${I},
    ${W},
    ${$},
    ${M},
    ${w},
    ${J},
    ${L},
    ${C},
    ${X},
    ${k},
    ${H},
    ${B},
    ${Z},
    ${ee},
    ${er},
    ${el},
    ${en},
    ${ei},
    ${_},
    ${T},
    ${h},
    ${G},
    ${D},
    ${x},
    ${es},
    ${ea},
    ${A},
    ${j},
    ${R},
    ${P},
    ${eo},
    ${eu},
    ${Q},
    ${ec},
    ${ed},
  }
`,ep=t.groq`
  _id,
  _type,
  title,
  sku,
  basePrice,
  productFamily,
  "slug": slug.current,
  "description": description[]{
    ${o}
  },
  "longDescription": longDescription[]{
    ${o}
  },
  "productGallery": productGallery[]{
    ${n}
  },
  "image": productGallery[0]{
    ${n}
  },
  paymentMethodTypes,
  "displayName": metadata.displayName,
  "compareAtPrice": metadata.compareAtPrice,
  "displayPrice": metadata.displayPrice,
  summary,
  modules[] {
    _key,
    _type,
    _type == "accordion" => {
      "heading": heading[] { ${o} },
      items[] {
        _key,
        heading,
        richText[] { ${o} }
      }
    },
    _type == "featureGrid" => {
      richText[] { ${o} },
      grid[] {
        _key,
        heading,
        richText[] { ${o} }
      }
    },
    _type == "testimonySwimlane" => {
      title,
      richText[] { ${o} },
      testimonies[]-> {
        _id,
        name,
        quote
      }
    },
    _type == "professionalTestimonies" => {
      testimonies[]-> {
        _id,
        name,
        quote
      }
    },
    _type == "youMayAlsoLike" => {
      heading,
      description,
      features[] {
        _key,
        kind,
        title,
        eyebrow,
        meta,
        ctaLabel,
        "imageUrl": coalesce(
          image.asset->url,
          entry->documentAttributes.mainImage.asset->url
        ),
        "entry": entry-> {
          _id,
          _type,
          title,
          "slug": slug.current,
          _type == "event" => {
            "location": activeEventInstance->eventLocation.location,
            "startDate": activeEventInstance->startDate,
            "endDate": activeEventInstance->endDate,
            "minTicketPrice": math::min(activeEventInstance->ticketTypes[]->price)
          }
        }
      },
      // Dynamic program tiles: every for-sale tool except the one being
      // viewed. $slug/$lang are bound by both tool detail queries — the
      // only consumers of this projection.
      "programs": *[
        _type == "tool" &&
        forSale == true &&
        slug.current != $slug &&
        (language == $lang || language == 'en' || !defined(language))
      ] | order(sortOrder asc)[0...6] {
        _id,
        title,
        "slug": slug.current,
        toolType,
        "coverImageUrl": coverImage.asset->url,
        "basePrice": product->basePrice,
        "displayPrice": product->metadata.displayPrice
      }
    }
  }
`,em=t.groq`
  *[_type=="settingsGeneral"][0] {
    "home": coalesce(
      homepage[language == $lang][0],
      homepage[language == 'en'][0]
    ).value -> {
      _id,
      title,
      ${s},
      ${eg},
      "relatedPosts":  *[_type == "post" ] | order(startDate desc, _createdAt asc)[0...5]{
        ${d}
      },
      "relatedPodcasts":  *[_type == "podcast" ] | order(publishedAt desc, _createdAt asc)[0...6]{
        ${d}
      },
    }
  }
`,ey=t.groq`
  *[_type=="settingsGeneral"][0] {
    "errorPage": coalesce(
      errorPage[language == $lang][0],
      errorPage[language == 'en'][0]
    ).value -> {
      _id,
      title,
      ${s},
      ${eg},
      "relatedPosts":  *[_type == "post" ] | order(startDate desc, _createdAt asc)[0...5]{
        ${d}
      },
      "relatedPodcasts":  *[_type == "podcast" ] | order(publishedAt desc, _createdAt asc)[0...6]{
        ${d}
      },
    }
  }
`;e.s(["errorPageQuery",0,ey,"homePageQuery",0,em],924887);let e_=t.groq`
  [
    ...*[_type == "page" && slug.current == $slug && language == $lang && dontRender != true],
    ...*[_type == "page" && slug.current == $slug && language == 'en' && dontRender != true],
    ...*[_type == "page" && slug.current == $slug && dontRender != true]
  ][0] {
    _id,
    _type,
    title,
    "slug": slug.current,
    ${c},
    ${eg},
    ${s},
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      "slug": slug.current,
    },
    "relatedPosts":  *[_type == "post" ] | order(startDate desc, _createdAt desc)[0...5]{
      ${d}
    },
    "relatedPodcasts":  *[_type == "podcast" ] | order(startDate desc, _createdAt desc)[0...7]{
      ${d}
    },
  }
`;t.groq`
  [
    ...*[_type == "landingPage" && slug.current == $slug && language == $lang && dontRender != true],
    ...*[_type == "landingPage" && slug.current == $slug && language == 'en' && dontRender != true],
    ...*[_type == "landingPage" && slug.current == $slug && dontRender != true]
  ][0] {
    _id,
    _type,
    title,
    "slug": slug.current,
    ${c},
    ${eg},
    ${s},
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      "slug": slug.current,
    },
  }
`,t.groq`
  [
    ...*[_type == "confirmationPage" && slug.current == $slug && language == $lang && dontRender != true],
    ...*[_type == "confirmationPage" && slug.current == $slug && language == 'en' && dontRender != true],
    ...*[_type == "confirmationPage" && slug.current == $slug && dontRender != true]
  ][0] {
    _id,
    _type,
    title,
    "slug": slug.current,
    ${c},
    ${eg},
    ${s},
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      "slug": slug.current,
    },
  }
`;let e$=t.groq`
  [
    ...*[_type == "terms" && slug.current == $slug && language == $lang],
    ...*[_type == "terms" && slug.current == $slug && language == 'en'],
    ...*[_type == "terms" && slug.current == $slug]
  ][0] {
    _id,
    _type,
    title,
    "slug": slug.current,
    body[] {
      ${o}
    },
    ${s},
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      "slug": slug.current,
    }
  }
`;t.groq`
  [
    ...*[_type == "signupPage" && slug.current == $slug && language == $lang],
    ...*[_type == "signupPage" && slug.current == $slug && language == 'en'],
    ...*[_type == "signupPage" && slug.current == $slug]
  ][0] {
    _id,
    _type,
    title,
    "slug": slug.current,
    pageHeadline,
    pageSubtitle,
    backgroundImage {
      ${n}
    },
    imagePosition,
    formFields[] {
      _key,
      fieldKey,
      label,
      placeholder,
      required
    },
    ctaButtonText,
    ctaLoadingText,
    signInLinkText,
    signInLinkUrl,
    footerText,
    termsCheckboxPrefix,
    termsLinkText,
    termsUrl,
    ${c},
    thankYouHeadline,
    thankYouBody,
    thankYouSteps[] {
      _key,
      stepTitle,
      stepDescription
    },
    thankYouCtaText,
    thankYouCtaUrl,
    ${s},
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      "slug": slug.current,
    },
  }
`,e.s(["pagesBySlugQuery",0,e_,"termsBySlugQuery",0,e$],951233);let eh=t.groq`
  *[_type == "postsIndex"][0]{
    "title": coalesce(
      title[language == $lang][0],
      title[language == 'en'][0]
    ).value,
    "themes": *[_type == "theme"]{
      title,
      slug
    },
    featuredPosts[]->{
      ${d}
    },
    "modules": coalesce(
      pageModules[language == $lang][0],
      pageModules[language == 'en'][0]
    ).value-> {
      ${eg}
    },
    ${s}
  }
`,ev=t.groq`
  [
    ...*[_type == "post" && slug.current == $slug && language == $lang],
    ...*[_type == "post" && slug.current == $slug]
  ][0] {
    _id,
    _type,
    title,
    "slug": slug.current,
    body[] {
      ${o}
    },
    mainImage {
      ${n}
    },
    themes[]->{
      title,
      "slug": slug.current,
    },
    event[]->{
      title,
      "slug": slug.current,
    },
    excerpt,
    ${s},
    "related": *[_type == "post" != (slug.current == $slug) && count(themes[@._ref in ^.^.themes[]._ref]) > 0 || count(event[@._ref in ^.^.event[]._ref]) > 0 ] | order(publishedAt desc, _createdAt desc) [0..5] {
      ${d}
    },
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      "slug": slug.current,
    }
  }
`,eb=t.groq`
  *[_type == "podcastsIndex"][0]{
    "title": coalesce(
      title[language == $lang][0],
      title[language == 'en'][0]
    ).value,
    "themes": *[_type == "theme"]{
      title,
      slug
    },
    featuredPodcasts[]->{
      ${d}
    },
    "modules": coalesce(
      pageModules[language == $lang][0],
      pageModules[language == 'en'][0]
    ).value-> {
      ${eg}
    },
    ${s}
  }
`,ef=t.groq`
  [
    ...*[_type == "podcast" && slug.current == $slug && language == $lang],
    ...*[_type == "podcast" && slug.current == $slug]
  ][0] {
    _id,
    _type,
    publishedAt,
    title,
    mainImage {
      ${n}
    },
    shortDescription,
    themes[]->{
      title
    },
    "slug": slug.current,
    body[] {
      ${o}
    },
    "audio": audio.asset->fileURL,
    podcastLink,
    ${s},

    "related": *[_type == "podcast" && count(themes[@._ref in ^.^.themes[]._ref]) > 0 && slug.current != $slug ] | order(publishedAt desc, _createdAt desc) [0..5] {
      _id,
      title,
      excerpt,
      mainImage {
        ${n}
      },
      "audio": audio.asset->fileURL,
      publishedAt,
      "slug": slug.current,
      themes[]->{
        title,
        "slug": slug.current,
      },
    },
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      "slug": slug.current,
    }
  }
`;t.groq`
  [
    ...*[_type == "theme" && slug.current == $slug && language == $lang],
    ...*[_type == "theme" && slug.current == $slug]
  ][0] {
    _id,
    _type,
    title,
    "slug": slug.current,
    ${eg},
    ${c},
    ${s},
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      "slug": slug.current,
    },
    "themes": *[_type == 'theme' && defined(slug.current)],
    "relatedPosts":  *[_type == "post" && references(^._id) ] | order(startDate desc, _createdAt desc)[0...5]{
      ${d}
    },
    "relatedPodcasts":  *[_type == "podcast" && references(^._id) ] | order(publishedAt desc, _createdAt desc)[0...7]{
      ${d}
    },
  }
`,t.groq`
  *[_type == "careersIndex"][0]{
    "title": coalesce(
      title[language == $lang][0],
      title[language == 'en'][0]
    ).value,
    "subHeading": coalesce(
      subHeading[language == $lang][0],
      subHeading[language == 'en'][0]
    ).value,
    "richText": coalesce(
      richText[language == $lang][0],
      richText[language == 'en'][0]
    ).value[] {
        ${o}
      },
    "modules": coalesce(
      pageModules[language == $lang][0],
      pageModules[language == 'en'][0]
    ).value-> {
      ${eg}
    },
    ${s}
  }
`,e.s(["podcastsBySlugQuery",0,ef,"podcastsPageQuery",0,eb,"postsBySlugQuery",0,ev,"postsPageQuery",0,eh],177968);let eT=t.groq`
  *[_type == "eventsCalendar"][0]{
    "title": coalesce(
      title[language == $lang][0],
      title[language == 'en'][0]
    ).value,
    "richText": coalesce(
      richText[language == $lang][0],
      richText[language == 'en'][0]
    ).value[] {
        ${o}
      },
    "modules": coalesce(
      pageModules[language == $lang][0],
      pageModules[language == 'en'][0]
    ).value-> {
      ${eg}
    }
  }
`,ek=t.groq`
  [
    ...*[_type == "event" && slug.current == $slug && language == $lang],
    ...*[_type == "event" && slug.current == $slug]
  ][0] {
    ${p},
    ${eg},
    "relatedPosts":  *[_type == "post" && references(^._id)] | order(startDate desc, _createdAt desc)[0...7]{
      ${d}
    },
    ${s},
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      "slug": slug.current,
    }
  }
`,ex=t.groq`
  *[_type == "eventInstance" && slug.current == $instanceSlug][0] {
    "slug": slug.current,
    _id,
    title,
    "displayTitle": coalesce(
      displayName[language == $lang][0],
      displayName[language == 'en'][0]
    ).value,
    startDate,
    endDate,
    location,
    eventLocation {
      type,
      location
    },
    timezone,
    salesActive,
    external_url,
    event->{
      ${p},
      ${eg},
    },
    ticketTypes[]->{
      _id,
      title,
      "displayName": coalesce(
        displayName[language == $lang][0],
        displayName[language == 'en'][0]
      ).value,
      "description": coalesce(
        description[language == $lang][0],
        description[language == 'en'][0]
      ).value,
      price
    }
  }
`;t.groq`
  *[_type == "eventInstance" && slug.current == $instanceSlug][0] {
    "slug": slug.current,
    _id,
    title,
    successUrl,
    termsAndConditionsUrl,
    startDate,
    endDate,
    location,
    eventLocation {
      type,
      location
    },
    timezone,
    "successMessage": coalesce(
        successMessage[language == $lang][0],
        successMessage[language == 'en'][0]
      ).value,
    event->{
      ${p},
    },
    "ticket": *[_type == "eventTicketType" && _id == $ticketId][0] {
      _id,
      sku,
      title,
      successUrl,
      termsAndConditionsUrl,
      "displayName": coalesce(
        displayName[language == $lang][0],
        displayName[language == 'en'][0]
      ).value,
      "description": coalesce(
        description[language == $lang][0],
        description[language == 'en'][0]
      ).value,
      price,
      acceptAffirm,
      "successMessage": coalesce(
        successMessage[language == $lang][0],
        successMessage[language == 'en'][0]
      ).value,
      useV2Checkout,
      discountSupport {
        enabled,
        autoApplyCodes,
        allowedCodes[]->{_id, code},
        allowStacking,
        maxDiscountPercent
      }
    }
  }
`,t.groq`
  [
    ...*[_type == "program" && slug.current == $slug && language == $lang],
    ...*[_type == "program" && slug.current == $slug]
  ][0] {
    _id,
    _type,
    title,
    "slug": slug.current,
    ${c},
    headerButton {
      ${a}
    },
    ${eg},
      subscriptionOptions[]->{
        _id,
        sku,
        title,
        price,
        frequency,
        "displayName": coalesce(
          displayName[language == $lang][0],
          displayName[language == 'en'][0]
        ).value,
        "description": coalesce(
          description[language == $lang][0],
          description[language == 'en'][0]
        ).value,
      },

    ${s},
    "relatedPosts": *[_type == "post" && count(themes[@._ref in ^.^.themes[]._ref]) > 0 != (slug.current == $slug) ] | order(publishedAt desc, _createdAt desc) [0..5] {
      ${d}
    },
    "relatedPodcasts": *[_type == "podcast" && count(themes[@._ref in ^.^.themes[]._ref]) > 0 != (slug.current == $slug) ] | order(publishedAt desc, _createdAt desc) [0..7] {
      ${d}
    },
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      "slug": slug.current,
    }
  }
`,t.groq`
  *[_type == "program" && slug.current == $slug][0] {
    "slug": slug.current,
    _id,
    title,
    successUrl,
    termsAndConditionsUrl,
    "mainImage": documentAttributes.mainImage {
      ${n}
    },
    "titleLockup": documentAttributes.titleLockup {
      ${n}
    },
    "subscription": *[_type == "programSubscriptionType" && _id == $subscriptionId][0] {
      _id,
      sku,
      title,
      successUrl,
      termsAndConditionsUrl,
      productType,
      "displayName": coalesce(
        displayName[language == $lang][0],
        displayName[language == 'en'][0]
      ).value,
      "description": coalesce(
        description[language == $lang][0],
        description[language == 'en'][0]
      ).value,
      price,
      frequency,
      "successMessage": coalesce(
        successMessage[language == $lang][0],
        successMessage[language == 'en'][0]
      ).value,
      useV2Checkout
    }
  }
`,e.s(["eventInstancesBySlugQuery",0,ex,"eventsBySlugQuery",0,ek,"eventsCalendarPageQuery",0,eT],819147),t.groq`
  *[_type == "shopIndex"][0]{
    "title": coalesce(
      title[language == $lang][0],
      title[language == 'en'][0]
    ).value,
    featuredProduct -> {
      summary,
      themes[]->{
        id,
        title,
        slug
      },
      headerBackgroundImage {
        ${n}
      },
       productCategories[]->{
        icon{
          ${n}
        },
        title,
        _id
      },
      "title": store.title,
      "slug": store.slug.current,
      "price": store.variants[0]->store.price,
      "image": productGallery[0] {
        ${n}
      },
    },
    collectionMenu -> {
      items[] {
        columns,
        ${r},

      }
    },
    ${s}
  }
`;let eI=t.groq`
  [
    ...*[_type == "collection" && store.slug.current == $slug && language == $lang],
    ...*[_type == "collection" && store.slug.current == $slug]
  ][0]  {
    "id": store.id,
    "title": store.title,
    "heading":  coalesce(
        heading[language == $lang][0],
        heading[language == 'en'][0]
      ).value,
    featuredProduct -> {
      summary,
      themes[]->{
        id,
        title,
        slug
      },
      headerBackgroundImage {
        ${n}
      },
       productCategories[]->{
        icon{
          ${n}
        },
        title,
        _id
      },
      "title": store.title,
      "slug": store.slug.current,
      "price": store.variants[0]->store.price,
      "image": productGallery[0] {
        ${n}
      },
    },

    "slug": store.slug.current,
    ${s},
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      "slug": slug.current,
    },
    "shop": *[_type == "shopIndex"][0]{
      "title": coalesce(
        title[language == $lang][0],
        title[language == 'en'][0]
      ).value,
      featuredProduct -> {
      summary,
      themes[]->{
        id,
        title,
        slug
      },
      headerBackgroundImage {
        ${n}
      },
       productCategories[]->{
        icon{
          ${n}
        },
        title,
        _id
      },
      "title": store.title,
      "slug": store.slug.current,
      "price": store.variants[0]->store.price,
      "image": productGallery[0] {
        ${n}
      },
    },
      collectionMenu -> {
        items[] {
          columns,
          ${r},

        }
      },
    }
  }
`;t.groq`
  *[_type == "product" && store.slug.current == $slug && store.status == "active" && store.isDeleted != true]
  | order((language == $lang) desc)[0]  {
    "id": store.id,
    "title": store.title,
    "slug": store.slug.current,
    productCategories,
    description,
    disclaimers[]->{
      _key,
      icon {
        ${n},
      },
      title,
      text
    },
    template,
    summary,
    productGallery[] {
      ${n}
    },
    template == 'app' || template == 'audio' => {
      headerBackgroundImage {
        ${n}
      },
      headerForegroundImage {
        ${n}
      },
      headerDarkTheme,
      productCategories[]->{
        icon{
          ${n}
        },
        title,
        _id
      },
      "image": productGallery[0] {
        ${n}
      },
    },
    template == 'audio' => {
      "audioSample": audioSample.asset->fileURL,
      audioText,
    },
    themes[]->{
      title,
      slug
    },
    ${eg},
    ${s},
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      "slug": slug.current,
    }
  }
`,e.s(["collectionsBySlugQuery",0,eI],243963),t.groq`
  *[_type == "forYou"][0]{
    "title": coalesce(
      title[language == $lang][0],
      title[language == 'en'][0]
    ).value,
    "welcomeMessage": coalesce(
      welcomeMessage[language == $lang][0],
      welcomeMessage[language == 'en'][0]
    ).value,
    "introduction": coalesce(
      introduction[language == $lang][0],
      introduction[language == 'en'][0]
    ).value,
    "modules": coalesce(
      pageModules[language == $lang][0],
      pageModules[language == 'en'][0]
    ).value-> {
      ${eg}
    },
    "relatedPosts": *[_type == 'post' && defined(slug.current) && count(themes[@->slug.current in $themes[]]) > 0][0...7] {
      ${d}
    },
    "relatedPodcasts": *[_type == 'podcast' && defined(slug.current) && count(themes[@->slug.current in $themes[]]) > 0][0...7] {
      ${d}
    },
    "relatedEvents": *[_type == 'event' && defined(slug.current) && count(themes[@->slug.current in $themes[]]) > 0][0...2] {
      ${p}
    },
    "relatedProducts": *[_type == 'product' && count(themes[@->slug.current in $themes[]]) > 0][0...11] {
      "image": productGallery[0] {
        ${n}
      },
      store {
        "handle": slug.current,
        ...,
        variants[]->{
          ...,
        }
      },
      productCategories[]->{
        "slug": slug.current
      },
    },
    "collections": *[_type == 'productCategory']{
      title,
      "slug": slug.current
    }
  }
`,t.groq`*[_type == "orderForm" && slug.current == $slug][0]
{
  ...,
  _updatedAt,
  bumpHeadline,
  ctaButtonText,
  title,
  products[]{
    price,
    _type,
    name,
    _key,
    sku,
    description,
    displayPrice,
    paymentMethodTypes[],
    compareAtPrice,
    confirmation_url,
    hideOrderBump,
  },
  _createdAt,
  is_rri_event,
  rri_event -> {
    _id,
    salesforceId[],
    salesforceEventType,
  },
  theme,
  moneyBackGuarantee,
  moneyBackGuaranteeImage,
  bumpLast,
  tos_url,
  bumpProducts[]{
  ...,
    image{
      ${n}
    },
    price,
    _type,
    name,
    description,
    extendedDescription,
    _key,
    sku,
    hidden,
    headline,
    imageUrl,
    confirmation_url,
    override_product_confirmation
  },
  confirmation_routing,
  _id,
  _rev,
  _type,
  currency,
  locale,
  productType,
  pricebook,
  slug{
    current,
    _type
  },
  productDisplayType,
  paymentMethodTypes{
    affirm,
    us_bank_account,
    card
  },
  clientSecret,
  paymentIntentId,
  productImage,
  productLogo,
  valueStackContent[]{
    name,
    price,
    description,
  },
  productSelectHeadline,
  headline,
  totalValue,
  payInFullValue,
  bonusHeadline,
  moneyBackGuarantee,
  valueStackHeadline,
  valueStackSummary,
  payInFullBonus,

}
`,t.groq`
*[_type == "quiz" && slug.current == $slug][0] {
  _id,
  _type,
  title,
  slug,
  description[]{
    ${u}
  },
  mainImage {
    ${n}
  },
  quizType,
  scoringMode,
  ctaButtonText,
  steps[] {
    ...,
    stepDescription[]{
      ...,
      _type == 'videoEmbed' => {
        videoUrl
      }
    },
    image {
      ${n}
    },
    fields[] {
      _key,
      fieldLabel,
      quizfieldType,
      placeholder,
      required,
      dataKey,
      textValidationType,
      scoreMultiplier,
      hook,
      splitSelectLabel {
        leftLabel,
        rightLabel
      },
      options[] {
        _key,
        optionLabel,
        optionValue,
        score,
        optionDescription
      },
      scale {
        minValue,
        minLabel,
        maxValue,
        maxLabel
      }
    }
  },
  results[] {
    _key,
    title,
    description[]{
      ${u}
    },
    resultValue,
    minScore,
    maxScore,
    image {
      ${n}
    },
    modules[]{
      ...,
      _type == 'accordion' => {
        headline,
        moduleSettings,
        accordionItems[]{
          title,
          content
        }
      },
      _type == 'richText' => {
        headline,
        moduleSettings,
        content
      },
      _type == 'callToAction' => {
        title,
        richText,
        bgImage,
        "bgVideo": bgVideo.asset->fileURL,
        button,
        leftAligned,
        fadeOut
      }
    }
  },
  crmIntegration {
    enabled,
    fieldMappings[] {
      _key,
      fieldSource,
      quizField,
      resultField,
      customValue,
      transform,
      crmField-> {
        _id,
        name,
        crmProperty {
          name,
          label,
          fieldType
        }
      }
    }
  }
}
`,t.groq`
*[_type == "quiz" && defined(slug.current)][]{
  "slug": slug.current,
}
`,t.groq`*[_type == "orderFormV2" && slug.current == $slug][0]
{
  _id,
  _type,
  title,
  headline,
  slug {
    current
  },

  // Products for CheckoutOrchestrator
  products[]{
    _key,
    "product": product->{
      _id,
      "name": coalesce(^.overrideTitle, title),
      "description": coalesce(^.overrideDescription, longDescription),
      sku,
      "basePrice": coalesce(^.overridePrice, basePrice),
      "displayPrice": coalesce(^.overrideDisplayPrice, metadata.displayPrice),
      image {
        ${n}
      }
    },
    quantity,
    isRequired,
    paymentMethodTypesOverride[],
    // MT-30: Quantity configuration (form level, not product level)
    enableQuantity,
    minQuantity,
    maxQuantity,
    enableQuantityDiscounts,
    quantityDiscountTiers[]{
      minQuantity,
      discountType,
      discountValue,
      label
    },
    groupRateModalEnabled,
    groupRateThreshold,
    groupRateModalContent{
      headline,
      bodyText,
      ctaButtonText,
      dismissButtonText,
      phoneNumber
    }
  },

  // Bump products for CheckoutOrchestrator
  bumpProducts[]{
    _key,
    "product": product->{
      _id,
      "name": title,
      "description": longDescription,
      sku,
      "basePrice": coalesce(^.overridePrice, basePrice),
      "displayPrice": coalesce(^.overrideDisplayPrice, metadata.displayPrice),
      image {
        ${n}
      }
    },
    headline,
    extendedDescription,
    hidden,
    image {
      ${n}
    },
    // Bump quantity configuration
    enableQuantity,
    minQuantity,
    maxQuantity
  },

  // Visual content for left side
  productSelectHeadline,
  valueStackHeadline,
  valueStackContent[]{
    name,
    price,
    description
  },
  valueStackSummary,
  productImage {
    ${n}
  },
  productLogo {
    ${n}
  },
  totalValue,

  // Pay in full bonus content
  payInFullValue,
  payInFullBonus,
  bonusHeadline,

  // Money back guarantee
  moneyBackGuarantee,
  moneyBackGuaranteeImage {
    ${n}
  },

  // Settings needed for display and orchestrator
  currency,
  theme,
  dontRender,
  hideAddress,
  chargeInternationalShipping
}
`,t.groq`*[_type == "orderFormV2" && slug.current == $slug][0]
{
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug {
    current,
    _type
  },

  // Products with references
  products[]{
    _key,
    "product": product->{
      _id,
      "name": coalesce(^.overrideTitle, title),
      "description": coalesce(^.overrideDescription, longDescription),
      sku,
      "basePrice": coalesce(^.overridePrice, basePrice),
      "displayPrice": coalesce(^.overrideDisplayPrice, metadata.displayPrice),
      compareAtPrice,
      paymentMethodTypes[],
      confirmation_url,
      hideOrderBump,
      image {
        ${n}
      }
    },
    quantity,
    isRequired,
    paymentMethodTypesOverride[],
    // MT-30: Quantity configuration (form level, not product level)
    enableQuantity,
    minQuantity,
    maxQuantity,
    enableQuantityDiscounts,
    quantityDiscountTiers[]{
      minQuantity,
      discountType,
      discountValue,
      label
    },
    groupRateModalEnabled,
    groupRateThreshold,
    groupRateModalContent{
      headline,
      bodyText,
      ctaButtonText,
      dismissButtonText,
      phoneNumber
    }
  },

  // Bump products with references
  bumpProducts[]{
    _key,
    "product": product->{
      _id,
      "name": title,
      "description": longDescription,
      sku,
      "basePrice": coalesce(^.overridePrice, basePrice),
      "displayPrice": coalesce(^.overrideDisplayPrice, metadata.displayPrice),
      image {
        ${n}
      }
    },
    headline,
    extendedDescription,
    hidden,
    image {
      ${n}
    },
    // Bump quantity configuration
    enableQuantity,
    minQuantity,
    maxQuantity
  },

  // Tracking
  affiliateTrackingEnabled,
  partnerTrackingEnabled,

  // Discount support
  discountSupport {
    enabled,
    autoApplyCodes[],
    "allowedCodes": allowedCodes[]->{
      _id,
      code,
      discountType,
      discountValue,
      description,
      validFrom,
      validUntil,
      maxUses,
      currentUses,
      isActive
    },
    allowStacking,
    maxDiscountPercent
  },

  // Visual elements
  productSelectHeadline,
  productImage {
    ${n}
  },
  productLogo {
    ${n}
  },
  valueStackContent[]{
    name,
    price,
    description
  },
  bumpHeadline,
  ctaButtonText,
  tos_url,
  termsOverride,
  headline,
  totalValue,
  payInFullValue,
  valueStackHeadline,
  valueStackSummary,
  bonusHeadline,
  payInFullBonus,
  moneyBackGuarantee,
  moneyBackGuaranteeImage {
    ${n}
  },

  // Confirmation routing
  confirmation_routing {
    combinations[]{
      name,
      products {
        main_product_sku,
        bump_skus[]
      },
      confirmation_url,
      priority
    }
  },

  // Settings
  theme,
  productType,
  is_rri_event,
  rri_event->{
    _id,
    salesforceId[],
    salesforceEventType
  },
  currency,
  bumpLast,
  productDisplayType,
  dontRender,
  hideAddress,
  chargeInternationalShipping,
  internationalShippingPrice,
  countryTaxRates {
    enabled,
    rates[] {
      countryCode,
      rate,
      label
    }
  },
  consentSettings,

  // Metadata
  language,
  experiment,
  migratedFromV1,
  v1SourceId
}
`;let eP=t.groq`
  *[_type == "coach" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    image {
      ${n}
    },
    "bio": coalesce(
      bio[language == $lang][0],
      bio[language == 'en'][0]
    ).value,
    categories[]->{
      title,
      "slug": slug.current
    },
    order
  }
`;e.s(["coachBySlugQuery",0,eP],941190);let eA=`
  _key,
  title,
  order,
  number,
  mediaUrl,
  mediaType,
  duration,
  trackTime,
  mediaSize,
  isSample
`,eq=`
  _key,
  title,
  order,
  number,
  "mediaUrl": select(isSample == true => mediaUrl, null),
  mediaType,
  duration,
  trackTime,
  mediaSize,
  isSample
`,eS=`
  _key,
  title,
  description,
  order,
  tracks[] {
    ${eA}
  }
`,eD=`
  _key,
  title,
  description,
  order,
  tracks[] {
    ${eq}
  }
`,eL=`
  category->{
    _id,
    title,
    "slug": slug.current,
    color
  }
`;t.groq`
  *[_type == "tool" && (language == $lang || language == 'en' || !defined(language))] | order(title asc) {
    _id,
    title,
    subtitle,
    tagline,
    "slug": slug.current,
    shortDescription,
    description,
    toolType,
    "coverImageUrl": coverImage.asset->url,
    "bgImage": bgImage.asset->url,
    "color": color.hex,
    duration,
    "basePrice": product->basePrice,
    "displayPrice": product->metadata.displayPrice,
    sortOrder,
    forSale,
    comingSoon,
    ${eL},
    product->{
      _id,
      title,
      availableInShop
    },
    breakthroughProductIds,
    "sessionCount": count(sessions)
  }
`;let eU=`
  _key,
  title,
  kind,
  sizeBytes,
  durationSec,
  src,
  poster {
    ${n}
  }
`,eC=`
  [
    ...*[_type == "tool" && slug.current == $slug && language == $lang],
    ...*[_type == "tool" && slug.current == $slug && language == 'en'],
    ...*[_type == "tool" && slug.current == $slug && !defined(language)]
  ][0]
`,eB=`
    _id,
    title,
    subtitle,
    tagline,
    "slug": slug.current,
    shortDescription,
    description,
    toolType,
    coverImage {
      ${n}
    },
    "bgImage": bgImage.asset->url,
    "color": color.hex,
    duration,
    sortOrder,
    forSale,
    comingSoon,
    ${eL},
    instructors[]->{
      _id,
      "name": firstName + " " + lastName,
      firstName,
      lastName,
      title,
      headline,
      "imageUrl": photo.asset->url
    },
    relatedTools[]->{
      _id,
      title,
      "slug": slug.current,
      shortDescription,
      toolType,
      "coverImageUrl": coverImage.asset->url,
      "basePrice": product->basePrice,
      "displayPrice": product->metadata.displayPrice
    },
    breakthroughProductIds,
    "checkoutSlug": *[_type == "orderFormV2" && references(^.product._ref)][0].slug.current,
    product->{
      ${ep}
    }
`;t.groq`
  ${eC} {
    ${eB},
    toolDownload[] {
      ${eU}
    },
    sessions[] {
      ${eS},
      content[]
    },
    ${s}
  }
`,t.groq`
  ${eC} {
    ${eB},
    sessions[] {
      ${eD}
    },
    ${s}
  }
`,t.groq`
  *[_type == "tool" && (language == $lang || language == 'en' || !defined(language))] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    forSale
  }
`,t.groq`
  *[_type == "tool" && toolType == $toolType && (language == $lang || language == 'en' || !defined(language))] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    description,
    toolType,
    "coverImageUrl": coverImage.asset->url,
    "bgImage": bgImage.asset->url,
    "color": color.hex,
    duration,
    "basePrice": product->basePrice,
    "displayPrice": product->metadata.displayPrice,
    sortOrder,
    forSale,
    comingSoon,
    ${eL}
  }
`,t.groq`
  *[_type == "featuredMember"] | order(_updatedAt desc)[0] {
    _id,
    member,
    title,
    achievement,
    story,
    "avatarUrl": avatar.asset->url
  }
`,t.groq`
  *[_type == "communityEvent" && date >= now()] | order(date asc)[0...10] {
    _id,
    title,
    date,
    "communityName": community->name,
    "attendees": coalesce(attendeeCount, 0),
    eventType,
    url,
    location
  }
`,t.groq`
  *[_type == "community" && isActive == true] | order(sortOrder asc) {
    _id,
    experienceApiId,
    name,
    description,
    "imageUrl": image.asset->url,
    "color": color.hex,
    accessRequirements,
    upsell{
      eyebrow,
      heading,
      body,
      ctaLabel,
      ctaHref,
      "imageUrl": image.asset->url
    }
  }
`,t.groq`
  *[_type == "communityBadge"] | order(label asc) {
    _id,
    experienceApiId,
    "slug": slug.current,
    label,
    category,
    "imageUrl": image.asset->url,
    "color": color.hex
  }
`,t.groq`
  *[_type == "portalAccessControl"][0] {
    _id,
    _type,
    rules[] {
      _key,
      pathPattern,
      strategy,
      programTags,
      accessTags,
      deniedRedirect,
      upsell {
        eyebrow,
        heading,
        body,
        ctaLabel,
        ctaHref,
        "imageUrl": image.asset->url
      },
      description
    }
  }
`,t.groq`
  *[_type == "tonyAiSettings"][0] {
    _id,
    _type,
    upsell {
      eyebrow,
      heading,
      body,
      ctaLabel,
      ctaHref,
      "imageUrl": image.asset->url
    }
  }
`;let eM=t.groq`
  {
    "site": {
      "siteTitle": *[_type == "settingsGeneral"][0].siteTitle,
      "rootDomain": *[_type == "settingsGeneral"][0].siteURL,
      "general": *[_type == "settingsGeneral"][0]{
        facebookUrl,
        instagramUrl,
        linkedInUrl,
        xUrl,
        youTubeUrl,
        tikTokUrl,
        spotifyUrl
      },
      "header": *[_type == "settingsHeader"][0]{
        desktopMenu -> {
          items[] {
            columns,
            ${r},
            columns == false || columns == null => {
              navigationItemChildren[] {
                ${r},
                navigationItemGrandchildren[] {
                  ${r}
                },
              },
            },
            columns == true => {
              navColumns[]{
                links[] {
                  ${r},
                  navigationItemGrandchildren[] {
                    ${r}
                  },
                }
              }
            }
          }
        },
        mobileMenu -> {
          items[] {
            ${r}
          }
        },
      },
      "footer": *[_type == "settingsFooter"][0]{
        footerMenu -> {
          items[] {
            ${r}
          }
        },
        legalMenu -> {
          items[] {
            ${r}
          }
        },
        footerLinks[] {
          _key,
          title,
          navigationItemUrl {
            linkType,
            internalLink -> {
              _type,
              title,
              "slug": slug.current,
            },
            href,
            blank,
            modalText
          },
          text
        }
      },
      "member": *[_type == "settingsMember"][0]{
        memberMenu -> {
          items[] {
            ${r}
          }
        },
        "memberHomePage": coalesce(
          memberHomePage[language == $lang][0].value,
          memberHomePage[language == 'en'][0].value
        )->{
          _type,
          title,
          "slug": slug.current
        },
        memberLinks[] {
          _key,
          navigationItemUrl {
            linkType,
            internalLink -> {
              _type,
              title,
              "slug": slug.current,
            },
            href,
            blank,
            modalText
          },
          text
        },
        loginButtonText,
        dashboardButtonText
      },
      "loginScreen": *[_type == "settingsLoginScreen"][0]{
        enabled,
        defaultTitle,
        defaultSubtitle,
        showLogo,
        logo {
          ${n}
        },
        defaultBackgroundImage {
          ${n}
        }
      }
    }
  }
`;e.s(["settingsQuery",0,eM],580299);let eR=t.groq`
  *[_type in ["page", "theme", "program", "product", "post", "podcast", "event", "eventInstance", "collection", "eventsCalendar"]
    && (
      (_type == "eventsCalendar" && coalesce(
        title[language == $lang][0].value,
        title[language == 'en'][0].value
      ) match $queryString + '*')
      || (_type != "eventsCalendar" && title match $queryString + '*')
    )
      && hideFromSearch != true
        && dontRender != true
  ][$pageIndex...$limit]{
    "title": select(
      _type == "eventsCalendar" => coalesce(
        title[language == $lang][0].value,
        title[language == 'en'][0].value
      ),
      title
    ),
    excerpt,
    'slug': coalesce(slug.current, ''),
    _type,
    _type == 'post' || _type == 'podcast' => {
      "image": mainImage {
        ${n}
      }
    },
    _type == 'page' || _type == 'program' || _type == 'event' || _type == 'theme' => {
      "image": documentAttributes.mainImage {
        ${n}
      }
    }
  }
`;t.groq`
  *[_type in ["page", "post", "podcast", "event", "eventInstance", "collection", "product", "program", "theme"]
    && defined(slug.current)
    && dontRender != true
  ]{
    "slug": slug.current,
    _type,
    _updatedAt,
    language
  }
`,t.groq`
  *[_type == "redirect"]{
    source,
    destination,
    permanent
  }
`,t.groq`
  *[references($_id)]{
    _id,
    _type,
    "slug": slug.current
  }
`,e.s(["searchQuery",0,eR],337762),t.groq`
*[_type == "post" && defined(slug.current)] | order(publishedAt desc, _createdAt desc)[$pageIndex...$limit] {
  _id,
  title,
  mainImage {
    ${n}
  },
  excerpt,
  publishedAt,
  "slug": slug.current,
  themes[]->{
    title,
    "slug": slug.current,
  }
}
`,t.groq`
  *[_type == "podcast" && defined(slug.current)] | order(publishedAt desc, _createdAt desc)[$pageIndex...$limit] {
    _id,
    title,
    mainImage {
      ${n}
    },
    "audio": audio.asset->fileURL,
    duration,
    publishedAt,
    "slug": slug.current,
    themes[]->{
      title,
      "slug": slug.current,
    }
  }
`,t.groq`
  *[_type == "career"] | order(_createdAt desc)[$pageIndex...$limit] {
    _id,
    title,
    location,
    employeeType,
    url,
    _createdAt
  }
`,t.groq`
  *[_type == "post" && defined(slug.current) && $slug in themes[]->slug.current] | order(publishedAt desc, _createdAt desc)[$pageIndex...$limit] {
    ${d}
  }
`,t.groq`
  *[_type == "podcast" && defined(slug.current) && $slug in themes[]->slug.current] | order(publishedAt desc, _createdAt desc)[$pageIndex...$limit] {
    ${d}
  }
`,t.groq`
  *[_type == "post" && $themeSlug in themes[]->slug.current] | order(publishedAt desc, _createdAt desc)[0...12] {
    ${d}
  }
`,t.groq`
  *[_type == "event" && $themeSlug in themes[]->slug.current] {
    _id,
    title,
    eventType,
    ${c}
  }
`,t.groq`
  *[_type == "eventInstance" && endDate > now() && defined(slug.current) && defined(event->slug.current)] | order(startDate asc, _createdAt asc)[0] {
    _id,
    title,
    displayTitle,
    "slug": slug.current,
    startDate,
    endDate,
    location,
    eventLocation { type, location },
    timezone,
    salesActive,
    external_url,
    event-> {
      _id,
      title,
      "slug": slug.current,
      "color": color.hex,
      "titleLockup": documentAttributes.titleLockup { ${n} },
      "mainImage": documentAttributes.mainImage { ${n} }
    }
  }
`,t.groq`
  *[_type == "eventInstance" && endDate > now() && defined(slug.current)] | order(startDate asc, _createdAt asc)[] {
    "slug": slug.current,
    _id,
    displayTitle,
    title,
    startDate,
    endDate,
    location,
    eventLocation {
      type,
      location
    },
    timezone,
    salesActive,
    external_url,
    event->{
      _id,
      title,
      "slug": slug.current,
      eventType,
    },
  }
`,t.groq`
  *[_type == "eventInstance" && defined(slug.current)] | order(startDate asc, _createdAt asc)[] {
    "slug": slug.current,
    _id,
    displayTitle,
    title,
    startDate,
    endDate,
    location,
    eventLocation {
      type,
      location
    },
    timezone,
    salesActive,
    external_url,
    hideInCalendar,
    event->{
      _id,
      title,
      "slug": slug.current,
      eventType,
      primaryColor,
      secondaryColor,
    },
  }
`,t.groq`
{
  "coaches": *[_type == "coach"] | order(_createdAt desc) {
    firstName,
    lastName,
    title,
    'image': photo.asset->url,
    headline,
    trainings[],
    language[],
    "bio": coalesce(
      bio[language == $lang][0],
      bio[language == 'en'][0]
    ).value,
    'category': category->title
  },
  "coachingTypes": *[_type == "coachingType"] | order(title asc) {
    _id,
    title
  }
}
`,e.s([],916367)}]);