
interface IParameters {
  args: string[];
  files?: string[]
}

interface ConvOptions {
  dir?: string;
  fmt?: string;
}

interface ConvParameters extends IParameters {
  outputType: string;
}

interface CueOptions {
}

interface CueParameters extends IParameters {
}

interface JoinOptions {
  destfile?: string;
  dir?: string;
  fmt?: string;
}

interface JoinParameters extends IParameters {
  joinfile: string;
  destfile: string;
  outputType: string;
}
