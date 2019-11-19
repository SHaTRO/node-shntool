
interface ServiceParameters {
  args: string[];
  files?: string[];
}

interface ConvOptions {
  dir?: string;
  fmt?: string;
}

interface ConvParameters extends ServiceParameters {
  outputType: string;
}

interface CueOptions {
  destfile?: string;
}

interface CueParameters extends ServiceParameters {
  destfile: string;
}

interface JoinOptions {
  destfile?: string;
  dir?: string;
  fmt?: string;
}

interface JoinParameters extends ServiceParameters {
  joinfile: string;
  destfile: string;
  outputType: string;
}
