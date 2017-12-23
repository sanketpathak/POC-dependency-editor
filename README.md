# machine-ui
This repository deals about the generation of stacks based on user's custom interest.

Connection between POC-dependency-editor and fabric8-ui :-

## POC-dependency-editor :

In POC-dependency-editor, to establish a connection with fabric8-ui run the command given below

`$npm run watch:library`


## fabric8-ui:

Inside fabric8-ui repo commands to link and unlink the fabric8-ui with POC-dependency-editor as follows:

**Command TO LINK:**

Run the following command for connection

`$sudo npm link ../POC-dependency-editor/dist-watch/`


We provide various sample environments out of the box which make it easier to get started. They are all located as bash scripts in environments.

The default one you should use when you want to develop on the console is to reuse openshift.io production cluster:

```bash
source environments/openshift-prod-cluster.sh
```

Execute to start the UI with live reload enabled:

`$npm start`

**Command TO UNLINK :**

Run the following command to disconnect with POC-dependency-editor

`$sudo npm unlink analytics-driven-ui`



