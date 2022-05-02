# Coachium

# _CURRENTLY IN THE ALPHA STAGE, NOT MEANT FOR REGULAR USE AT THIS TIME!_

Web-based software for interfacing with CMA educational interfaces and sensors. 

Coachium serves as an alternative to the Coach software developed by CMA Amsterdam, which is used to communicate with interfaces and sensors made by the same company, which aid you in measuring different physical quantities and capturing measured data into a graph.

Since this application is web-based (using WebHID technology, which is currently only implemented in Chromium-based browsers), it is not limited to computers only running MS Windows. Even Chromebooks are now capable of using these devices.

Coachium is attempting to be as easy-to-use as possible (compared to the relatively complex CMA Coach), making it available for everyone. CMA Coach is in fact a highly extensive piece of software, which also means that even the simplest operations still require the user to have some prerequisite knowledge about using the software (eg. if you want to start a capture into a graph, first, you have to create a graph panel and configure it, then configure the capture and finally start the capture), without which you will not simply get by.

Thanks to the simple user interface of Coachium, everything makes sense, all operations which you might wish to perform are easily available in the panel of icons, which are all comprehensively labeled, nothing is ever hidden here.

That is why Coachium has to slightly differ to the way the old CMA Coach was used. Coachium operates on a "workbook" principle, meaning that if the user opens Coachium, they can create as many captures and graphs as they wish and then save it all as a single "workbook" file (ie. if you are performing current–voltage characteristics of several components, you don't have to save each component as an individual file). Of course, there is still the oprion (and it is highly recommended) to name each capture, so that the teacher could make sense of your handed in workbook.

Moreover, since Coachium is being developed in the 21st century, it has some modern "tricks" up its sleeve. Mainly, you are able to save your workbook of captures directly to your Google Drive with a single click, from where you can instantly hand it in to your teacher in Google Classroom.

We strongly hope that we have introduced to you what Coachium actually is, and we also hope that you will enjoy working with it!

## Supported devices

- CMA €Lab
- CMA intelligent sensors (most, if not all)

## Highlight features

- Ability to communicate with CMA interfaces and sensors using a web browser
- Modern easy-to-use user interface
- Multiple language support (currently only English and Czech are implemented)
- Capturing data in real time into charts
- Save a near infinite number of captures to a single workbook file (as opposed to Coach, which can only save a single capture per file), which can be then saved locally or to Google Drive (for submitting directly to Google Classroom, for example)

## Project roadmap

Please [click here](https://github.com/prochazkaml/Coachium/blob/master/todo) to view the current status of the Coachium to-do list.

**Coachium is currently in the alpha stage.** This means that not all of the features which I have originally planned have been implemented, and it still may be riddled with bugs.

### Alpha stage

Coachium will reach the alpha stage when it is ready to be used in lessons for basic tasks (current-voltage characteristics, figuring out the resistance of a resistor etc.), the bugs that I will notice during development are fixed and all of the basic features that are in the "Does not require hardware" and "Requires hardware" categories in the to-do list are implemented.

### Beta stage

Next will follow the beta stage, as expected. That will occur when I request from the teachers at our school to actually use Coachium instead of CMA Coach with students for a couple of classes, and all of the reported bugs/suggested features by the students as well as the teachers are fixed/implemented.

### Full release

Coachium will get the first full release when the software is stress-tested for a full school year. New features will be added (from the "Future stuff" category in the to-do list – will very likely be renamed at some point), bugs will be fixed and Coachium will receive a simple version numbering system for the users and server maintainers to easily keep track of the changes.

## How can I try it out?

If you are interested in trying this software out, visit our [central instance](https://coachium.prochazka.ml/). Beware that the default language of this instance is Czech, however, you can change that by clicking on the button in the top right corner.

If you do not own a compatible device for connecting, you can still experience some parts of Coachium by downloading and opening the [example file](https://github.com/prochazkaml/Coachium/blob/master/test.coachium) (in JSON format).

**However, if you are an educational institution wishing to use Coachium in your classes, it is highly recommended to run your own instance of Coachium on your own server, where you can select your own default language. See below for instructions.**

## How to set it up on a server

Since it is a simple static webpage, it is incredibly simple to set up. If you have a Linux server, do the following:

```bash
cd /var/www/html # Or any other directory where your server root is!
git clone https://github.com/prochazkaml/Coachium coachium # Make the downloaded repo lower-case
```

Then, open the file `i18n/default.js`, where you will see the following as the first line of actual code:

```js
const DEFAULT_LANGUAGE = "cs";
```

There, replace `cs` by your preferred language (i.e. `en` – see the `i18n` directory for all supported languages). Save the changes, and Coachium should be ready to use on your server!

To update your existing instance of Coachium to the latest version, run the following:

```bash
cd /var/www/html/coachium # Or wherever you installed Coachium
git pull
```

## How does Google Drive functionality work?

By default, on your own instance, all Google Drive-related functionality will not be accessible, because your origin is not on the list of the [allowed domains](https://github.com/prochazkaml/Coachium/blob/master/gdrive.html#L8).

Simply modifying your gdrive.html file will not work, since the app does not fetch this particular file from your instance, but from the [central instance](https://coachium.prochazka.ml/), because the Google client ID used in gdrive.html is tied to that particular domain.

Restricting access from unknown origins was done to prevent API abuse by applications other than Coachium and to pass the Google verification process.

Instructions for applying for a request to enable your domain name in the central instance will be published at a later date.

## My language is not supported!

_TODO_

## My hardware is not supported!

_TODO_
