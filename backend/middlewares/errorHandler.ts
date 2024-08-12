import { Response } from "express";

const handleError = (res: Response, error: unknown): void => {
    if (error instanceof Error) {
        res.status(500).json({ message: "Some Error Occurred" });
        console.error(error.message);
    } else {
        res.status(500).json({ message: "Unknown Error" });
    }
};

export default handleError;